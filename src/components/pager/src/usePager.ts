import { type MaybeComputedRef, type MaybeRef } from '@vueuse/core'
import { append, mapWithIndex, prepend } from 'fp-ts/Array'
import { constant, flow, pipe } from 'fp-ts/function'
import { match } from 'fp-ts/Either'
import { Ord } from 'fp-ts/number'
import { clamp } from 'fp-ts/Ord'
import { fromBoolean } from '~/helpers/fp/either'

export interface PagerOptions {
  showPageItemNum?: number
}

export type PagerItem = XOR<[{ type: 'page'; value: number }, { type: 'sep' }]>

export function usePager(originPage: MaybeComputedRef<number>, originMaxPage: MaybeComputedRef<number>, originOptions: MaybeRef<PagerOptions> = {}) {
  const [page, maxPage, options] = batchResolveComputed(originPage, originMaxPage, originOptions)

  const pages = computed(() => getCenterPage(page.value, maxPage.value, options.value.showPageItemNum ?? 5))

  return {
    pages,
  }
}

function getCenterPage(page: number, maxPage: number, onShowPageNumber: number): PagerItem[] {
  // ensure `pageNum` is odd
  const pageNum = onShowPageNumber + (1 - onShowPageNumber % 2)

  if (maxPage <= pageNum) {
    return createPageItemByLength(maxPage)
  }

  const pageMinLimit = 1
  const pageMaxLimit = maxPage - pageNum + 1

  const getValueBetweenNumberRange = clamp(Ord)(pageMinLimit, pageMaxLimit)
  const startPage = getValueBetweenNumberRange(page - (pageNum >> 1))
  const pages: PagerItem[] = createPageItemByLength(pageNum, startPage)

  return pipe(
    pages,
    handlePrevPager(startPage, pageMinLimit),
    handleLastPager(startPage, pageMaxLimit),
  )
}

function handlePrevPager(start: number, minLimit: number) {
  return makeHandlePagerFn(start, minLimit, prepend)
}

function handleLastPager(start: number, maxLimit: number) {
  return makeHandlePagerFn(start, maxLimit, append)
}

function makeHandlePagerFn(start: number, limit: number, appendFn: typeof append | typeof prepend) {
  const checkFn = fromBoolean(equalNumber(limit))
  const addPagerFn = flow(
    appendFn<PagerItem>(createPagerItem()),
    appendFn(createPagerItem(limit)),
  )

  return (pagers: PagerItem[]) => pipe(
    start,
    checkFn,
    match(
      constant(addPagerFn(pagers)),
      constant(pagers),
    ),
  )
}

function createPagerItem(page?: number): PagerItem {
  return page ? { type: 'page', value: page } : { type: 'sep' }
}

function createPageItemByLength(len: number, startPage = 1) {
  const createPageItemByList = mapWithIndex<number, PagerItem>((idx, startPage) => ({ type: 'page', value: startPage + idx }))

  return createPageItemByList(new Array(len).fill(startPage))
}
