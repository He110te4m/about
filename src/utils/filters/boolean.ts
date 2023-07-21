import { concatAll } from 'fp-ts/Monoid'
import { type Predicate, getMonoidAll, getMonoidAny } from 'fp-ts/Predicate'

export function allPass<A>(fn: Predicate<A>[]): Predicate<A> {
  return concatAll(getMonoidAll<A>())(fn)
}

export function anyPass<A>(fn: Predicate<A>[]): Predicate<A> {
  return concatAll(getMonoidAny<A>())(fn)
}
