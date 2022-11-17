import { type MaybeComputedRef, resolveUnref } from '@vueuse/core'
import { allPass, complement, curry, gt, lt } from 'ramda'

export function usePage<T>(originList: MaybeComputedRef<T[]>, originLimit: MaybeComputedRef<number>) {
  const currentPage = ref(1)
  const limit = computed(() => resolveUnref(originLimit))
  const start = computed(() => (currentPage.value - 1) * limit.value)

  const currentList = computed(() => resolveUnref(originList))
  const maxPage = computed(() => Math.ceil(currentList.value.length / limit.value))

  const list = computed(() => currentList.value.slice(start.value, start.value + limit.value))

  function jump(page: number) {
    const isValid = checkPage(page, maxPage.value)
    if (isValid) {
      currentPage.value = page
    }

    return isValid
  }

  return {
    page: computed(() => currentPage.value),
    maxPage,

    list,

    toNext: () => jump(currentPage.value + 1),
    toPrev: () => jump(currentPage.value - 1),
    jump,
  }
}

/**
 * invalid page value includes:
 * - over than `maxPage`
 * - less than `1`
 * - `NaN`
 * - no integer or with `e`, like `Math.PI` and `1e2`
 */
function checkPage(page: number, maxValue: number) {
  const minValue = 1

  const checkInvalidChars = curry(
    (invalidChars: string[], num: number) =>
      // TODO: It's no functional. The code here needs to be modified.
      invalidChars.every(char => !String(num).includes(char)),
  )

  return allPass([
    gt(maxValue),
    lt(minValue),
    complement(isNaN),
    checkInvalidChars(['.', 'e', 'b']),
  ])(page)
}
