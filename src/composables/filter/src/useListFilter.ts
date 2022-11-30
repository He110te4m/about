import { type MaybeComputedRef, type MaybeRef, resolveUnref } from '@vueuse/core'
import { constant, flow } from 'fp-ts/function'
import { filter, some } from 'fp-ts/Array'

type GeyKeyType<TData extends {}> = (keyof TData) & (string | number)

export interface ObjectListFilterOptions<TData extends {}, TKey extends GeyKeyType<TData>> {
  searchKey: TKey
  keyword?: TData[TKey]
}

type RequiredFilterOptions<TData extends {}, TKey extends GeyKeyType<TData>> = Required<ObjectListFilterOptions<TData, TKey>>

export function useObjectListFilter<TData extends {}, TKey extends GeyKeyType<TData>>(originList: MaybeComputedRef<TData[]>, options: MaybeRef<ObjectListFilterOptions<TData, TKey>>) {
  const filteredList = computed(() => {
    const list = resolveUnref(originList)
    const { searchKey, keyword } = unref(options)

    return !keyword ? list : filterObjectList(list, { searchKey, keyword })
  })

  return {
    list: filteredList,
  }
}

function filterObjectList<TData extends {}, TKey extends GeyKeyType<TData>>(list: TData[], { searchKey, keyword }: RequiredFilterOptions<TData, TKey>) {
  const isIncludeable = flow(
    getFiledValue(searchKey),
    isString,
  )
  const handleIncludeCompare = flow(
    getFiledValue<string>(searchKey),
    includesString(String(keyword)),
  )

  const isEqualable = flow(
    getFiledValue(searchKey),
    anyPass([isBoolean, isNumber]),
  )
  const equal = cond<number | boolean, boolean>([
    [isNumber, equalNumber(Number(keyword))],
    [isBoolean, equalBoolean(Boolean(keyword))],
  ])(constant(false))
  const handleEqualCompare = flow(
    getFiledValue<number | boolean>(searchKey),
    equal,
  )

  const isArrayItem = flow(
    getFiledValue(searchKey),
    isArray,
  )
  const handleArrayItemCompare = flow(
    getFiledValue<unknown[]>(searchKey),
    filter(isString),
    some(equalString(String(keyword))),
  )

  return filter(
    cond([
      [isIncludeable, handleIncludeCompare],
      [isEqualable, handleEqualCompare],
      [isArrayItem, handleArrayItemCompare],
    ])(constant(false)),
  )(list)
}
