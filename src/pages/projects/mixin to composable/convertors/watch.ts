import { type WatchStopHandle, watch } from 'vue-demi'
import type { Mixin } from '../types'

export function convertWatch(mixin: Mixin, proxy: any) {
  const watchs: Record<string, WatchStopHandle> = {}

  if (mixin.watch) {
    Object.keys(mixin.watch)
      .forEach((varName) => {
        const option = mixin.watch[varName]
        if (typeof option === 'function') {
          watchs[varName] = watch(() => proxy[varName], option)
          return
        }

        const { handler, ...rest } = option

        watchs[varName] = watch(() => proxy[varName], handler, rest)
      })
  }

  return watchs
}
