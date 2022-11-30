import type { MaybeComputedRef } from '@vueuse/core'
import type { ComputedRef } from 'vue'
import { Ord } from 'fp-ts/number'
import { between } from 'fp-ts/Ord'
import { not } from 'fp-ts/Predicate'

export function usePage<T>(originList: MaybeComputedRef<T[]>, originLimit: MaybeComputedRef<number>) {
  const [currentList, limit] = batchResolveComputed(originList, originLimit)

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

    jump,
  }
}

function makeJump(maxPage: ComputedRef<number>) {
  const { on, trigger } = createEventHook<number>()
  return {
    onAfterValidSuccess: on,
    jump: (page: number) => {
      const isValid = checkPage(page, maxPage.value)
      if (isValid) {
        trigger(page)
      }
    },
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

  const checkInvalidChars = (invalidChars: string[]) =>
    (num: number) => invalidChars.every(char => !String(num).includes(char))

  return allPass([
    between(Ord)(minValue, maxValue),
    not(isNaN),
    checkInvalidChars(['.', 'e', 'b']),
  ])(page)
}
