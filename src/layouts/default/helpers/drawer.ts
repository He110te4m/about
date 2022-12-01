import { filter, map, reduce } from 'fp-ts/Array'
import { MonoidAny } from 'fp-ts/boolean'
import { constant, flow } from 'fp-ts/function'
import { Ord } from 'fp-ts/number'
import { between } from 'fp-ts/Ord'
import { randomBool, randomInt } from 'fp-ts/Random'

type Direction = 'top' | 'left' | 'right' | 'bottom'
type Point = Record<'x' | 'y', number>
type Line = Record<'start' | 'end', Point>
enum AngleEnum {
  a0 = 0,
  a15 = Math.PI / 12,
  a90 = Math.PI / 2,
  a180 = Math.PI,
}
type Vector = Point & { angle: AngleEnum }

type MixedPoint = Direction | Vector

type ViewSize = Record<'width' | 'height', number>

interface BranchesDrawerOptions {
  startPoint: MixedPoint[]
  branchLengthRange: [number, number]
  branchDestroyedTimes: number
  viewSize: ViewSize
}

export class BranchesDrawer {
  #vectors: Vector[] = []
  #getBranchLength: () => number
  #checkOverView: (point: Point) => boolean
  #formatVectors: (points: BranchesDrawerOptions['startPoint']) => Vector[]

  constructor({ startPoint, branchLengthRange, branchDestroyedTimes, viewSize }: BranchesDrawerOptions) {
    this.#formatVectors = makeFormatVectors(viewSize)
    this.reset(startPoint)

    this.#getBranchLength = makeRandomLengthFactory(branchLengthRange)

    const overSizeLength = Math.max(...branchLengthRange) * branchDestroyedTimes
    this.#checkOverView = makeCheckOverView(overSizeLength, viewSize)
  }

  reset(points: BranchesDrawerOptions['startPoint']) {
    this.#vectors = this.#formatVectors(points)
  }

  next(whetherToRandomlyPrune = false) {
    if (!this.#vectors.length) {
      return []
    }

    // generate lines
    const convertVectorToLine = makeConvertVectorToLine(this.#getBranchLength)
    const originLines: Line[] = map(convertVectorToLine)(this.#vectors)

    // prune lines
    const purneOverView = flow(
      getFiledValue<Point, Line>('end'),
      this.#checkOverView,
    )
    const filterLines = filter(
      purneOverView,
      // allPass([pruneRandomly, purneOverView]),
    )
    const lines = filterLines(originLines)

    const pruneRandomly = anyPass([
      constant(!whetherToRandomlyPrune),
      randomBool,
    ])
    const newVectors = createNextVectors(lines, this.#vectors)
    this.#vectors = filter(pruneRandomly)(newVectors)

    return lines
  }
}

function createNextVectors(lines: Line[], originVectors: Vector[]): Vector[] {
  const angleMap = createAngleMap(originVectors)

  return makeVectors(lines, angleMap)
}

function createAngleMap(vectors: Vector[]) {
  const angleMap: Record<string, AngleEnum> = {}
  const updateAngleMap = reduce(angleMap, (obj: Record<string, AngleEnum>, vector: Vector) => {
    obj[createKeyByPoint(vector)] = vector.angle
    return obj
  })
  updateAngleMap(vectors)

  return angleMap
}

function makeVectors(lines: Line[], angleMap: Record<string, AngleEnum>) {
  return reduce<Line, Vector[]>([], (list: Vector[], { start, end }: Line) => {
    const key = createKeyByPoint(start)
    const newAngles: AngleEnum[] = getNextAngleList(angleMap[key])

    const makeVectors = map<AngleEnum, Vector>((angle: AngleEnum) => ({ ...end, angle }))

    return list.concat(makeVectors(newAngles))
  })(lines)
}

function createKeyByPoint({ x, y }: Point): string {
  return `${x}-${y}`
}

function getNextAngleList(angle?: AngleEnum): AngleEnum[] {
  if (isUndefined(angle)) {
    return []
  }

  return [
    angle - AngleEnum.a15,
    angle + AngleEnum.a15,
  ]
}

function makeConvertVectorToLine(getLength: () => number) {
  return ({ x, y, angle }: Vector): Line => {
    const distance = getLength()
    const dx = distance * Math.cos(angle)
    const dy = distance * Math.sin(angle)

    return {
      start: { x, y },
      end: { x: x + dx, y: y + dy },
    }
  }
}

function makeFormatVectors(size: ViewSize): (points: MixedPoint[]) => Vector[] {
  const getPointByDirectory = makePointConvertor(size)

  const formatVector = (point: MixedPoint) => isString(point) ? getPointByDirectory(point) : point

  return map<MixedPoint, Vector>(formatVector)
}

function makePointConvertor({ width, height }: ViewSize): (dir: Direction) => Vector {
  const getRandomWidth = randomInt(0, width)
  const getRandomHeight = randomInt(0, height)

  const randomWidth = getRandomWidth()
  const randomHeight = getRandomHeight()

  const isTop = equalString('top')
  const makeTopVector = constant({ x: randomWidth, y: 0, angle: AngleEnum.a90 })

  const isLeft = equalString('left')
  const makeLeftVector = constant({ x: 0, y: randomHeight, angle: AngleEnum.a0 })

  const isRight = equalString('right')
  const makeRightVector = constant({ x: width, y: randomHeight, angle: AngleEnum.a180 })

  const isBottom = equalString('bottom')
  const makeBottomVector = constant({ x: randomWidth, y: height, angle: -AngleEnum.a90 })

  return cond<string, Vector>([
    [isTop, makeTopVector],
    [isLeft, makeLeftVector],
    [isRight, makeRightVector],
    [isBottom, makeBottomVector],
  ])(constant({ x: 0, y: 0, angle: AngleEnum.a0 }))
}

function makeRandomLengthFactory(list: number[]) {
  const { min, max } = getMinMax(list)

  return randomInt(min, max)
}

function makeCheckOverView(overSizeLength: number, { width, height }: ViewSize) {
  const minWidth = 0 - overSizeLength
  const maxWidth = width + overSizeLength

  const minHeight = 0 - overSizeLength
  const maxHeight = height + overSizeLength

  const numBetween = between(Ord)

  return ({ x, y }: Point) => MonoidAny.concat(
    numBetween(minWidth, maxWidth)(x),
    numBetween(minHeight, maxHeight)(y),
  )
}

function getMinMax(list: number[]) {
  return {
    min: Math.min(...list),
    max: Math.max(...list),
  }
}
