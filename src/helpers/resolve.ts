import { type MaybeComputedRef } from '@vueuse/core'
import type { ComputedRef } from 'vue'
import { map } from 'fp-ts/Array'

export function batchResolveComputed<T1>(arg1: MaybeComputedRef<T1>): [ComputedRef<T1>]
export function batchResolveComputed<T1, T2>(arg1: MaybeComputedRef<T1>, arg2: MaybeComputedRef<T2>): [ComputedRef<T1>, ComputedRef<T2>]
export function batchResolveComputed<T1, T2, T3>(arg1: MaybeComputedRef<T1>, arg2: MaybeComputedRef<T2>, arg3: MaybeComputedRef<T3>): [ComputedRef<T1>, ComputedRef<T2>, ComputedRef<T3>]
export function batchResolveComputed<T1, T2, T3, T4>(arg1: MaybeComputedRef<T1>, arg2: MaybeComputedRef<T2>, arg3: MaybeComputedRef<T3>, arg4: MaybeComputedRef<T4>): [ComputedRef<T1>, ComputedRef<T2>, ComputedRef<T3>, ComputedRef<T4>]
export function batchResolveComputed(...args: MaybeComputedRef<unknown>[]): ComputedRef<unknown>[] {
  return map(item => computed(() => resolveUnref(item)))(args)
}
