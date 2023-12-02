import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import {
  apply,
  flow,
  getMonoid as getFunctionMonoid,
  pipe,
} from 'fp-ts/function'
import type { Predicate } from 'fp-ts/Predicate'
import { concatAll } from 'fp-ts/Monoid'
import { first } from 'fp-ts/Semigroup'

export function guard<A, B>(branches: Array<[Predicate<A>, (x: A) => B]>) {
  return (fallback: (x: A) => B) =>
    (input: A): B =>
      pipe(
        branches,
        A.map(([f, g]) => flow(O.fromPredicate(f), O.map(g))),
        concatAll(getFunctionMonoid(O.getMonoid<B>(first()))<A>()),
        apply(input),
        O.getOrElse(() => fallback(input)),
      )
}
