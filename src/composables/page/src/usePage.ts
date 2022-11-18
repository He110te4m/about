import { type MaybeComputedRef, resolveUnref } from '@vueuse/core'
import { allPass, complement, curry, gt, lt } from 'ramda'
import type { ComputedRef } from 'vue'

export function usePage<T>(originList: MaybeComputedRef<T[]>, originLimit: MaybeComputedRef<number>) {
  const [currentList, limit] = getComputedValues(originList, originLimit)

  const currentPage = ref(1)
  const start = computed(() => (currentPage.value - 1) * limit.value)

  const maxPage = computed(() => Math.ceil(currentList.value.length / limit.value))

  const list = computed(() => currentList.value.slice(start.value, start.value + limit.value))

  const { onAfterValidSuccess, jump } = makeJump(maxPage)
  onAfterValidSuccess((page) => {
    currentPage.value = page
  })

  return {
    page: computed(() => currentPage.value),
    maxPage,

    list,

    toNext: () => jump(currentPage.value + 1),
    toPrev: () => jump(currentPage.value - 1),
    jump,
  }
}

function makeJump(maxPage: ComputedRef<number>) {
  const { on, trigger } = createEventHook<number>()
  return {
    onAfterValidSuccess: (cb: (page: number) => void) => on(cb),
    jump: (page: number) => {
      const isValid = checkPage(page, maxPage.value)
      if (isValid) {
        trigger(page)
      }
    },
  }
}

// TODO: change to functional
function getComputedValues<T1>(arg1: MaybeComputedRef<T1>): [ComputedRef<T1>]
function getComputedValues<T1, T2>(arg1: MaybeComputedRef<T1>, arg2: MaybeComputedRef<T2>): [ComputedRef<T1>, ComputedRef<T2>]
function getComputedValues(...args: MaybeComputedRef<unknown>[]) {
  return args.map(item => computed(() => resolveUnref(item)))
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
