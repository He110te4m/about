import type { MaybeArray } from '../types'

export function ensureArray<T>(items: MaybeArray<T>) {
  return Array.isArray(items)
    ? items
    : [items]
}
