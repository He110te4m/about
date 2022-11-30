export const getFiledValue = <TValue, TData extends {} = Record<keyof any, unknown>, TKey extends keyof TData = keyof TData>(searchKey: TKey) => (data: TData) => (data[searchKey] as TValue)
