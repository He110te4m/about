import { filter, match } from 'fp-ts/Array'
import { constant, flow } from 'fp-ts/function'
import type { PagerItem } from '..'

const filterPage = filter<PagerItem>(item => item.type === 'page')
const emptyPageItemMsg = 'has empty page items'
const getPageCountMsg = (count: number) => `has ${count} page items`
export function getMatchPageMsg(count: number) {
  return count ? getPageCountMsg(count) : emptyPageItemMsg
}
export const matchPage = flow(
  filterPage,
  match(
    constant(emptyPageItemMsg),
    arr => getPageCountMsg(arr.length),
  ),
)

const filterSep = filter<PagerItem>(item => item.type === 'sep')
const emptySepItemMsg = 'has empty sep items'
const getSepCountMsg = (count: number) => `has ${count} sep items`
export function getMatchSepMsg(count: number) {
  return count ? getSepCountMsg(count) : emptySepItemMsg
}
export const matchSep = flow(
  filterSep,
  match(
    constant(emptySepItemMsg),
    arr => getSepCountMsg(arr.length),
  ),
)
