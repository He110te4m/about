import { type MaybeComputedRef, type MaybeRef, resolveUnref } from '@vueuse/core'

export interface ObjectListFilterOptions<TData extends {}, TKey extends keyof TData> {
  searchKey: TKey
  keyword?: TData[TKey]
}

export function useObjectListFilter<TData extends {}, TKey extends keyof TData>(originList: MaybeComputedRef<TData[]>, options: MaybeRef<ObjectListFilterOptions<TData, TKey>>) {
  const filteredList = computed(() => {
    const list = resolveUnref(originList)
    const { searchKey, keyword } = unref(options)
    if (!keyword) {
      return list
    }

    return list.filter((item) => {
      if (typeof item[searchKey] === 'boolean') {
        return item[searchKey]
      }
      if (typeof item[searchKey] === 'string') {
        return item[searchKey].includes(keyword)
      }
      if (typeof item[searchKey] === 'number' || typeof item[searchKey] === 'bigint') {
        return item[searchKey] === keyword
      }

      return false
    })
  })

  return {
    list: filteredList,
  }
}
