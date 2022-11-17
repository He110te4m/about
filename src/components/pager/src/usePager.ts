import { type MaybeComputedRef, type MaybeRef, resolveUnref } from '@vueuse/core'

export interface PagerOptions {
  showPageItemNum?: number
}

export type PagerItem = XOR<[{ type: 'page'; value: number }, { type: 'sep' }]>

export function usePager(originPage: MaybeComputedRef<number>, originMaxPage: MaybeComputedRef<number>, originOptions: MaybeRef<PagerOptions> = {}) {
  const page = computed(() => resolveUnref(originPage))
  const maxPage = computed(() => resolveUnref(originMaxPage))
  const options = computed(() => resolveUnref(originOptions))

  const pages = computed(() => getCenterPage(page.value, maxPage.value, options.value.showPageItemNum ?? 5))

  return {
    pages,
  }
}

function getCenterPage(page: number, maxPage: number, originLimit: number): PagerItem[] {
  const limit = originLimit + (1 - originLimit % 2)
  if (maxPage <= limit) {
    return new Array(maxPage).fill(null).map((_, idx) => ({ type: 'page', value: idx + 1 }))
  }

  const pageMinLimit = 1
  const pageMaxLimit = maxPage - limit + 1

  const startPage = Math.min(
    Math.max(pageMinLimit, page - (limit >> 1)),
    pageMaxLimit,
  )
  let pages: PagerItem[] = new Array(limit).fill(null).map((_, idx) => ({ type: 'page', value: startPage + idx }))

  pages = getPrevList().concat(
    pages,
    getNextList(maxPage),
  )

  if (startPage === pageMinLimit) {
    pages = pages.slice(2)
  } else if (startPage === pageMaxLimit) {
    pages = pages.slice(0, -2)
  }

  return pages
}

function getPrevList(startPage = 1): PagerItem[] {
  return [
    { type: 'page', value: startPage },
    { type: 'sep' },
  ]
}

function getNextList(endPage: number): PagerItem[] {
  return [
    { type: 'sep' },
    { type: 'page', value: endPage },
  ]
}
