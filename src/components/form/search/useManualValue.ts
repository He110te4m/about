import { useManualRefHistory } from '@vueuse/core'
import { type Ref, ref, unref, watchEffect } from 'vue'

export function useManualValue<T>(value: Ref<T>) {
  const { history, commit: change } = useManualRefHistory(value, { capacity: 1 })
  const manualValue = ref(unref(value)) as Ref<T>
  watchEffect(() => {
    manualValue.value = history.value[0].snapshot
  })

  return {
    manualValue,
    change,
  }
}
