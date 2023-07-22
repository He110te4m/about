import { getOrElse } from 'fp-ts/lib/Option'
import { constant, flow } from 'fp-ts/lib/function'
import { lookup } from 'fp-ts/lib/Record'

export function prop<Return>(propName: string): (...a: readonly unknown[]) => Return | undefined
export function prop<Return>(propName: string, defaultValue: Return): (...a: readonly unknown[]) => Return
export function prop<Return>(propName: string, defaultValue?: Return) {
  return flow(
    // @ts-expect-error 这里类型会读不出来， ts 无法自动推导
    lookup(propName),
    getOrElse(constant(defaultValue)),
  )
}
