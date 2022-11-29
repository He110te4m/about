import { type MaybeComputedRef, type MaybeRef, resolveUnref } from '@vueuse/core'
import { T, always, any, anyPass, compose, cond, equals, filter, includes, prop, propEq } from 'ramda'
import { isArray, isBoolean, isNumber, isString } from '~/helpers/typeof'

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
  const isIncludeable = compose(isString, prop(searchKey))
  const handleIncludeCompare = compose(includes(keyword), prop(searchKey))

  const isEqualable = compose(
    anyPass([isBoolean, isNumber]),
    prop(searchKey),
  )
  const handleEqualCompare = propEq(searchKey, keyword)

  const isArrayItem = compose(isArray, prop(searchKey))
  const handleArrayItemCompare = compose(any(equals(keyword)), prop(searchKey))

  return filter(
    cond([
      [isIncludeable, handleIncludeCompare],
      [isEqualable, handleEqualCompare],
      [isArrayItem, handleArrayItemCompare],
      [T, always(false)],
    ]),
    list,
  )
}
