import { getOrElse } from 'fp-ts/Option'
import { constant, flow } from 'fp-ts/function'
import { lookup } from 'fp-ts/Record'

export function prop(propName: string, defaultValue = '') {
  return flow(
    // @ts-expect-error 这里类型会读不出来， ts 无法自动推导
    lookup(propName),
    getOrElse(constant(defaultValue)),
  )
}
