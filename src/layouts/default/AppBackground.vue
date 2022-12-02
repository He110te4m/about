<script lang='ts' setup>
import { CanvasOperator } from './operators/CanvasOperator'
import { DrawerOperator } from './operators/DrawerOperator'

const el = ref<HTMLCanvasElement>()

onMounted(() => {
  const { width, height } = reactive(useWindowSize())
  const size = { width, height }

  const drawer = new DrawerOperator({
    startPoint: [],
    branchLengthRange: [8, 12],
    viewSize: size,
    branchDestroyedTimes: 3,
  })

  const canvasHandler = new CanvasOperator(el.value!, size)

  let times = 0
  let lastTime = performance.now()
  const minTimes = 3
  const minInterval = 1000 / 40

  const rafControl = useRafFn(requestFrame, { immediate: false })

  function requestFrame() {
    if (performance.now() - lastTime < minInterval) {
      return
    }

    const lines = drawer.next(times > minTimes)
    if (!lines.length) {
      rafControl.pause()
    }

    lines.forEach(line => canvasHandler.drawCanvasLine(line))

    times++
    lastTime = performance.now()
  }

  const reset = () => {
    canvasHandler.reset({
      strokeStyle: '#ddd3',
    })
    drawer.reset(['top', 'left', 'right', 'bottom'])
  }

  reset()
  nextTick(rafControl.resume)
})
</script>

<template>
  <div class="fixed top-0 bottom-0 left-0 right-0 pointer-events-none canvas-background--wrapper">
    <canvas ref="el" />
  </div>
</template>

<style scoped>
.canvas-background--wrapper {
  --mask: radial-gradient(circle, transparent, black);

  z-index: -1;
  mask-image: var(--mask);
  --webkit-mask-image: var(--mask)
}
</style>
