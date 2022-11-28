export class CacheOperator<TData extends object> {
  #data: Map<keyof TData, TData[keyof TData]>

  constructor() {
    this.#data = new Map<keyof TData, TData[keyof TData]>()
  }

  get<TKey extends keyof TData>(key: TKey) {
    return this.#data.get(key) as TData[TKey] | undefined
  }

  set<TKey extends keyof TData>(key: TKey, value: TData[TKey]) {
    this.#data.set(key, value)
  }

  has(key: keyof TData) {
    return this.#data.has(key)
  }

  delete(key: keyof TData) {
    this.#data.delete(key)
  }

  clear() {
    this.#data.clear()
  }
}
