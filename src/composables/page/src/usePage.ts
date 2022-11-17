import { type MaybeComputedRef, resolveUnref } from '@vueuse/core'

export function usePage<T>(originList: MaybeComputedRef<T[]>, originLimit: MaybeComputedRef<number>) {
  const currentPage = ref(1)
  const limit = computed(() => resolveUnref(originLimit))
  const start = computed(() => (currentPage.value - 1) * limit.value)

  const currentList = computed(() => resolveUnref(originList))
  const maxPage = computed(() => Math.ceil(currentList.value.length / limit.value))

  const list = computed(() => currentList.value.slice(start.value, start.value + limit.value))

  function jump(page: number) {
    // invalid page value includes:
    // - over than `maxPage`
    // - less than `1`
    // - `NaN`
    // - no integer or with `e`, like `Math.PI` and `1e2`
    if (page > maxPage.value || page < 1 || isNaN(page) || ['.', 'e'].some(char => String(page).includes(char))) {
      return false
    }

    currentPage.value = page
    return true
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
