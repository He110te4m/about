import type { Line, Point } from '../types'

type BranchesPoint = Point & { angle: number }
type Direction = 'left' | 'right' | 'top' | 'bottom'
type DrawingZoneSize = Record<'width' | 'height', number>

enum angleEnum {
  a0 = 0,
  a15 = Math.PI / 12,
  a90 = Math.PI / 2,
  a180 = Math.PI,
}

interface BranchesDrawerOptions {
  lineLength: [number, number]
  branchNum: number
  lineDestroyedTimes: number
}

const defaultBranchesDrawerOptions: BranchesDrawerOptions = {
  lineLength: [5, 7],
  branchNum: 2,
  lineDestroyedTimes: 5,
}

export type BranchesStartPosition = BranchesPoint | Direction

export class BranchesDrawer {
  #points: BranchesPoint[]
  #size: DrawingZoneSize
  #options: BranchesDrawerOptions

  constructor(startPoints: BranchesStartPosition[], size: DrawingZoneSize, options: Partial<BranchesDrawerOptions> = {}) {
    this.#options = {
      ...defaultBranchesDrawerOptions,
      ...options,
    }
    this.#size = size
    this.#points = this.formatPoints(startPoints)
  }

  pruning(cb: (point: BranchesPoint, index: number, array: BranchesPoint[]) => boolean) {
    this.#points = this.#points.filter(cb)
  }

  setPoints(points: BranchesStartPosition[]) {
    this.#points = this.formatPoints(points)
  }

  generateNextSteps() {
    const points = this.#points
    const nextPoints: BranchesPoint[] = []
    const lines: Line[] = []

    points.forEach(
      (point) => {
        const line = this.generateLineByBranchPoint(point)
        lines.push(line)

        const { x, y } = line.end

        // The line has overflowed the screen and it will be destroyed automatically
        if (this.checkLinesOverflow({ x, y })) {
          return
        }

        const angleList = this.getNextAngleList(point.angle)

        nextPoints.push(...angleList.map(angle => ({
          x,
          y,
          angle,
        })))
      },
    )

    this.#points = nextPoints

    return lines
  }

  private checkLinesOverflow({ x, y }: Point) {
    const { width, height } = this.#size
    const overSize = Math.max(...this.#options.lineLength) * this.#options.lineDestroyedTimes

    return x < 0 - overSize
      || y < 0 - overSize
      || x > width + overSize
      || y > height + overSize
  }

  private getNextAngleList(angle: number): number[] {
    const { branchNum } = this.#options
    const isOdd = Boolean(branchNum & 1)
    const num = branchNum >> 1

    const angleList: number[] = []

    new Array(branchNum + Number(!isOdd))
      .fill(null)
      .forEach(
        (_, idx) => {
          if (idx === num) {
            if (isOdd) {
              angleList.push(0)
            }
            return
          }

          angleList.push(angle + (num - idx) * angleEnum.a15)
        },
      )

    return angleList
  }

  private generateLineByBranchPoint(point: BranchesPoint): Line {
    return {
      start: reactiveOmit(point, 'angle'),
      end: this.getLineEndPoint(point),
    }
  }

  private getLineEndPoint(point: BranchesPoint): Point {
    const { x, y, angle } = point
    const lineLength = this.getBranchLength()

    const dx = lineLength * Math.cos(angle)
    const dy = lineLength * Math.sin(angle)

    return {
      x: x + dx,
      y: y + dy,
    }
  }

  private getBranchLength() {
    const [min, max] = this.#options.lineLength
    return Math.floor(Math.random() * Math.abs(max - min)) + Math.min(min, max)
  }

  private formatPoints(points: BranchesStartPosition[]) {
    return points.map(
      item => typeof item === 'object' ? item : this.getPointByDirection(item),
    )
  }

  private getPointByDirection(dir: Direction): BranchesPoint {
    let x = 0
    let y = 0
    let angle = 0

    const { width, height } = this.#size

    switch (dir) {
      case 'bottom':
        x = Math.random() * width
        y = height
        angle = -angleEnum.a90
        break

      case 'left':
        x = 0
        y = Math.random() * height
        angle = angleEnum.a0
        break

      case 'right':
        x = width
        y = Math.random() * height
        angle = angleEnum.a180
        break

      case 'top':
        x = Math.random() * width
        y = 0
        angle = angleEnum.a90
        break

      default:
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-case-declarations
        const n: never = dir
        break
    }

    return { x, y, angle }
  }
}
