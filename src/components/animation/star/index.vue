<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { StarAnimater } from './animater'
import { useAnimaterCount } from './useAnimaterCount'
import { useAnimater } from './animate'

const containerRef = ref<HTMLDivElement>()

const { animater } = useAnimater()
const { count } = useAnimaterCount()

onMounted(() => {
  if (animater.value) {
    return
  }

  const starAnimater = new StarAnimater(containerRef.value!, { starCount: count.value })
  animater.value = starAnimater
})

const router = useRouter()
const { goFast, goSlow } = useAnimater()
router.beforeEach(goFast)
router.afterEach(goSlow)
</script>

<template>
  <div ref="containerRef" class="container" h="full" w="full" select="none" />
</template>
