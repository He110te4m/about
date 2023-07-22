import { filter, reduce } from 'fp-ts/lib/Array'
import type { Predicate } from 'fp-ts/lib/Predicate'
import { constTrue, flow } from 'fp-ts/lib/function'
import type { MaybeRef } from 'vue'

export function useFilter<T>(data: MaybeRef<T[]>, conditions: Predicate<T>[]) {
  const dataRef = ref(data) as Ref<T[]>
  const filterFn = pipeCondition(conditions)

  return computed(() => filterFn<T>(unref(dataRef)))
}

function pipeCondition<T>(conditions: Predicate<T>[]) {
  const reducer = reduce(
    filter<T>(constTrue),
    (acc, cur: Predicate<T>) => flow(acc, filter(cur)),
  )

  return reducer(conditions)
}
