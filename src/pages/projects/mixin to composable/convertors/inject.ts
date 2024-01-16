import { inject } from 'vue-demi'
import type { AnyObject, Mixin } from '../types'

export function convertInjectData(mixin: Mixin) {
  let injectData: AnyObject = {}

  if (mixin.inject) {
    if (Array.isArray(mixin.inject)) {
      injectData = getInjectDataFromArray(mixin.inject)
    } else {
      injectData = getInjectDataFromObject(mixin.inject)
    }
  }

  return injectData
}

function getInjectDataFromArray(injectOptions: string[]) {
  const injectData: AnyObject = {}

  injectOptions.forEach((name) => {
    injectData[name] = inject(name)
  })

  return injectData
}

function getInjectDataFromObject(injectOptions: AnyObject) {
  const injectData: AnyObject = {}
  Object.keys(injectOptions).forEach((key) => {
    const val = injectOptions[key]
    if (typeof val === 'object') {
      const injectKey = val.from ?? key
      injectData[key] = inject(injectKey, val.default)
    } else {
      injectData[key] = inject(val)
    }
  })

  return injectData
}
