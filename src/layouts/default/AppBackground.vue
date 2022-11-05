<script lang='ts' setup>
import { CanvasOperator } from './helpers/canvas'
import { BranchesDrawer, type BranchesStartPosition } from './helpers/drawer'
import { renderBranches } from './helpers/renderBranches'

const el = ref<HTMLCanvasElement>()

let rafControl: ReturnType<typeof useRafFn> | null = null
let reset: () => void = () => {}

onMounted(() => {
  const { width, height } = reactive(useWindowSize())
  const size = { width, height }

  const branchesStart: BranchesStartPosition[] = ['top', 'bottom', 'left', 'right']
  const drawer = new BranchesDrawer(branchesStart, size)

  const canvasHandler = new CanvasOperator(el.value!, size)
  const { requestFrame, reset: resetRender } = renderBranches(canvasHandler, drawer, {
    minTimes: 3,
    minInterval: 1000 / 40,
    filterRatio: 0.5,
  })
  rafControl = useRafFn(requestFrame, { immediate: false })

  const drawerColor = '#88888825'
  reset = () => {
    canvasHandler.reset({
      strokeStyle: drawerColor,
    })
    drawer.setPoints(branchesStart)
    resetRender()
  }

  startAnimation()
})

function startAnimation() {
  if (!rafControl) {
    return
  }

  rafControl.pause()
  reset()
  rafControl.resume()
}
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
