import { constant, flow } from 'fp-ts/function'
import { getOrElse } from 'fp-ts/Option'
import { filterString } from './string'

export function filterTitle(keyword: string) {
  return flow(
    // @ts-expect-error 这里类型会读不出来， ts 无法自动推导
    lookup('title'),
    getOrElse(constant('')),
    filterString(keyword),
  )
}
