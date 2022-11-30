import { apply, flow, getMonoid as getFunctionMonoid, pipe } from 'fp-ts/function'
import { map as arrayMap } from 'fp-ts/Array'
import { concatAll } from 'fp-ts/Monoid'
import { type Predicate, getMonoidAll, getMonoidAny } from 'fp-ts/Predicate'
import { first } from 'fp-ts/Semigroup'
import { fromPredicate, getMonoid as getOptionMonoid, getOrElse, map as objectMap } from 'fp-ts/Option'

export const allPass = <A>(fn: Array<Predicate<A>>): Predicate<A> =>
  concatAll(getMonoidAll<A>())(fn)

export const anyPass = <A>(fn: Array<Predicate<A>>): Predicate<A> =>
  concatAll(getMonoidAny<A>())(fn)

export const cond
  = <A, B>(branches: Array<[Predicate<A>, (x: A) => B]>) =>
    (fallback: (x: A) => B) =>
      (input: A): B =>
        pipe(
          branches,
          arrayMap(([f, g]) => flow(fromPredicate(f), objectMap(g))),
          concatAll(getFunctionMonoid(getOptionMonoid<B>(first()))<A>()),
          apply(input),
          getOrElse(() => fallback(input)),
        )
