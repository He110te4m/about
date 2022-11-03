declare global {
  type MaybePromise<T> = T extends Promise<infer TOrigin> ? TOrigin | T : T | Promise<T>
}

export {}
