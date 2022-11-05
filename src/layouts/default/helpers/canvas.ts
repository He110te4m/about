import type { Line } from '../types'

interface CanvasInitOptions {
  width: number
  height: number
  dpi?: number
}

const defaultDrawerConfig = ({
  lineWidth: 1,
  strokeStyle: 'transparent',
}) as const

type CanvasDrawerConfigKeys = keyof typeof defaultDrawerConfig

type CanvasDrawerConfig = Partial<Pick<CanvasRenderingContext2D, CanvasDrawerConfigKeys>>

export class CanvasOperator {
  #ctx: Nullable<CanvasRenderingContext2D>
  #initOptions: CanvasInitOptions

  constructor(el: HTMLCanvasElement, options: CanvasInitOptions) {
    this.#initOptions = options
    this.#ctx = this.initCanvasContext(el, options)
  }

  drawCanvasLine({ start, end }: Line) {
    const ctx = this.#ctx
    if (!ctx) {
      return
    }

    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
  }

  reset(config: CanvasDrawerConfig = {}) {
    const ctx = this.#ctx
    if (!ctx) {
      return
    }

    const { width, height } = this.#initOptions

    ctx.clearRect(0, 0, width, height);

    (Object.keys(defaultDrawerConfig) as CanvasDrawerConfigKeys[]).forEach((key) => {
      ctx[key] = (config[key] ?? defaultDrawerConfig[key] as any)
    })
  }

  private initCanvasContext(el: HTMLCanvasElement, { width, height }: CanvasInitOptions) {
    const ctx = el.getContext('2d')

    const canvasDpi = this.getCanvasDPI()

    el.style.width = `${width}px`
    el.style.height = `${height}px`
    el.width = canvasDpi * width
    el.height = canvasDpi * height

    ctx?.scale(canvasDpi, canvasDpi)

    return ctx
  }

  private getCanvasDPI() {
    return this.#initOptions.dpi ?? window.devicePixelRatio ?? 1
  }
}
