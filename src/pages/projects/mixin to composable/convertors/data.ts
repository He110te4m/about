import { ref } from 'vue-demi'
import type { AnyObject, Mixin } from '../types'

export function convertData(mixin: Mixin) {
  const data: AnyObject = {}

  if (mixin.data) {
    const componentData = typeof mixin.data === 'function'
      ? mixin.data()
      : mixin.data

    for (const key of Object.keys(componentData)) {
      const initVal = componentData[key]
      data[key] = ref(initVal)
    }
  }

  return data
}
