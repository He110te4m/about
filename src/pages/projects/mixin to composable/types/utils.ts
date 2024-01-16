export type MaybeArray<T> = T extends Array<infer Item>
  ? Item | T
  : T | T[]
