type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XORBetween<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

declare global {
  type MaybePromise<T> = T extends Promise<infer TOrigin> ? TOrigin | T : T | Promise<T>;
  type XOR<T extends any[]> =
    T extends [infer Only] ? Only :
    T extends [infer A, infer B, ...infer Rest] ? XOR<[XORBetween<A, B>, ...Rest]> :
    never;
  type Nullable<T> = T | null
  type Fn<TReturn extends unknown = unknown, TArgs extends unknown[] = unknown[]> = (...args: TArgs) => TReturn
  type ValueOf<T> = T extends unknown[] ?
    T[number] :
    T extends Promise<unknown> ?
      Awaited<T> :
      T extends object ?
        T[keyof T] :
        T
}

export {}
