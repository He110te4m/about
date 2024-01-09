import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/Array'
import {
  apply,
  flow,
  getMonoid as getFunctionMonoid,
  pipe,
} from 'fp-ts/lib/function'
import type { Predicate } from 'fp-ts/lib/Predicate'
import { concatAll } from 'fp-ts/lib/Monoid'
import { first } from 'fp-ts/lib/Semigroup'

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
