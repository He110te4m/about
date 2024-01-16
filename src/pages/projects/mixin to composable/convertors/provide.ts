import { provide } from 'vue-demi'
import type { AnyObject, Mixin } from '../types'

export function convertProvideData(mixin: Mixin, proxy: any) {
  if (mixin.provide) {
    const provideData: AnyObject = typeof mixin.provide === 'function'
      ? mixin.provide.bind(proxy)()
      : mixin.provide

    Reflect.ownKeys(provideData)
      .forEach((key) => {
        provide(key, provideData[key])
      })
  }
}
