import { computed } from 'vue-demi'
import type { AnyObject, Mixin } from '../types'

export function convertComputed(mixin: Mixin, proxy: any) {
  const computedData: AnyObject = {}

  if (mixin.computed) {
    for (const name of Object.keys(mixin.computed)) {
      const fn = mixin.computed[name]
      if (typeof fn === 'function') {
        computedData[name] = computed(fn.bind(proxy))
      }
    }
  }

  return computedData
}
