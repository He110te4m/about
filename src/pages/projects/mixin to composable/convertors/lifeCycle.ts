import {
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onErrorCaptured,
  onMounted,
  onServerPrefetch,
  onUnmounted,
  onUpdated,
} from 'vue-demi'
import type { Mixin } from '../types'
import { ensureArray } from '../utils'

const commonLifeCycles = {
  beforeMount: onBeforeMount,
  mounted: onMounted,
  beforeUpdate: onBeforeUpdate,
  updated: onUpdated,
  activated: onActivated,
  deactivated: onDeactivated,
  beforeDestroy: onBeforeUnmount,
  destroyed: onUnmounted,
  errorCaptured: onErrorCaptured,
  serverPrefetch: onServerPrefetch,
}
type LifeCycleName = keyof typeof commonLifeCycles

const lifeCycleNames = Object.keys(commonLifeCycles)

export function convertLifeCycle(mixin: Mixin, proxy: any) {
  Object.keys(mixin)
    .filter((key): key is LifeCycleName => lifeCycleNames.includes(key))
    .forEach((cycleName) => {
      ensureArray(mixin[cycleName])
        .filter((fn: (() => void) | undefined) => fn)
        .forEach((fn: () => void) => {
          commonLifeCycles[cycleName](
            fn.bind(proxy),
          )
        })
    })

  const cycles = [mixin.beforeCreate, mixin.created]
  cycles.forEach((cycle = []) => {
    ensureArray(cycle)
      .forEach((fn: () => void) => fn.bind(proxy)())
  })
}
