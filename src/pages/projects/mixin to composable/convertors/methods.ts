import type { Mixin } from '../types'

export function convertMethods(mixin: Mixin, proxy: any) {
  const methods: Record<string, any> = {}

  if (mixin.methods) {
    for (const name of Object.keys(mixin.methods)) {
      methods[name] = mixin.methods[name].bind(proxy)
    }
  }

  return methods
}
