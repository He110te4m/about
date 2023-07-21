import { filter, reduce } from 'fp-ts/Array'
import type { Predicate } from 'fp-ts/lib/Predicate'
import { constTrue, flow } from 'fp-ts/lib/function'
import type { MaybeRef } from 'vue'

export function useFilter<T extends any[]>(data: MaybeRef<T>, conditions: Predicate<T[number]>[]) {
  const dataRef = ref(data)
  const filterFn = pipeCondition(conditions)

  return computed(() => filterFn(unref(dataRef)))
}

function pipeCondition<T>(conditions: Predicate<T>[]) {
  const reducer = reduce(
    filter<T>(constTrue),
    (acc, cur: Predicate<T>) => flow(acc, filter(cur)),
  )

  return reducer(conditions)
}
