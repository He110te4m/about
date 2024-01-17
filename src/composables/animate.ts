import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import type { StarAnimater } from '~/components/animation/star/animater'

const useAnimaterStore = defineStore('animater', () => {
  const animater = ref<StarAnimater>()

  return {
    animater,
  }
})

export function useAnimater() {
  const { animater } = storeToRefs(useAnimaterStore())

  return {
    animater,
    goFast: () => animater.value?.fast(),
    goSlow: () => animater.value?.slow(),
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAnimaterStore, import.meta.hot))
}
