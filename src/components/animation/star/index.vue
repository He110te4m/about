<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { StarAnimater } from './animater'
import { useAnimaterStore } from '~/stores/animater'

const containerRef = ref<HTMLDivElement>()

const { animater } = storeToRefs(useAnimaterStore())

onMounted(() => {
  if (animater.value) {
    return
  }

  const starAnimater = new StarAnimater(containerRef.value!)
  animater.value = starAnimater
})
</script>

<template>
  <div ref="containerRef" class="container" h="full" w="full" />
</template>
