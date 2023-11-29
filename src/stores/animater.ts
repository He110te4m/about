import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import type { StarAnimater } from '~/components/animation/star/animater'

export const useAnimaterStore = defineStore('animater', () => {
  const animater = ref<StarAnimater>()

  return {
    animater,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAnimaterStore as any, import.meta.hot))
}
