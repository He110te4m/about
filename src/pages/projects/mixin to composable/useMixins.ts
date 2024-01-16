import { convertMixin } from './convertors'
import type { MaybeArray, Mixin } from './types'
import { ensureArray } from './utils'

export function useMixins(_mixins: MaybeArray<Mixin>) {
  const mixins = ensureArray(_mixins)

  return mixins.map(convertMixin)
}
