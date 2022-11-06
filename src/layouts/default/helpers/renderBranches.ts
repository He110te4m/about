import type { CanvasOperator } from './canvas'
import type { BranchesDrawer } from './drawer'

interface RenderOptions {
  minTimes: number
  minInterval: number
  filterRatio: number
}

export function renderBranches(canvasHandler: CanvasOperator, drawer: BranchesDrawer, { minTimes, minInterval, filterRatio }: RenderOptions) {
  let times = 0
  let lastTime = 0

  reset()

  return {
    requestFrame,
    reset,
  }

  function requestFrame(stop: () => void = () => {}) {
    if ((performance.now() - lastTime) < minInterval) {
      return
    }

    if (times > minTimes) {
      drawer.pruning(() => Math.random() > filterRatio)
    }

    const lines = drawer.generateNextSteps()
    if (!lines.length) {
      stop()
      return
    }

    lines.forEach((line) => {
      canvasHandler.drawCanvasLine(line)
    })

    times++
    lastTime = performance.now()
  }

  function reset() {
    times = 0
    lastTime = performance.now()
  }
}
