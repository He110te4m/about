import { type Option, getOrElse } from 'fp-ts/lib/Option'
import { constant, flow } from 'fp-ts/lib/function'
import { lookup } from 'fp-ts/lib/Record'

export function prop<Return>(propName: string): (...a: readonly unknown[]) => Return | undefined
export function prop<Return>(propName: string, defaultValue: Return): (...a: readonly unknown[]) => Return
export function prop<Return>(propName: string, defaultValue?: Return) {
  return flow(
    lookup(propName) as (r: Record<string, Return>) => Option<Return>,
    getOrElse(constant(defaultValue)),
  )
}
