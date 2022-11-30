import { has } from 'fp-ts/Record'
import type { LocationQuery } from 'vue-router'
import type { Article } from '~/components/article'
import type { ObjectListFilterOptions } from '~/composables/filter'

type FilterOptions = ObjectListFilterOptions<Article, 'category' | 'tags'>

/**
 * Transfer the filter state
 */
export function useFilterOptions() {
  const filterOptions = ref<FilterOptions>(getDefaultFilterOptions())
  const route = useRoute()
  watch(
    () => route.query,
    (query = {}) => {
      filterOptions.value = getFilterOptions(query)
    },
    { immediate: true, deep: true },
  )

  return {
    filterOptions,
  }
}

function getFilterOptions(query: LocationQuery = {}): FilterOptions {
  const hasTag = makeHasQueryKey('tag')
  const hasCategory = makeHasQueryKey('category')

  return cond([
    [hasTag, composeTagsFilterOptions],
    [hasCategory, composeCategoryFilterOptions],
  ])(getDefaultFilterOptions)(query)
}

function makeHasQueryKey(key: string) {
  return (query: LocationQuery) => has(key, query)
}

function composeCategoryFilterOptions({ category }: LocationQuery): FilterOptions {
  return {
    searchKey: 'category',
    keyword: isString(category) ? category : '',
  }
}

function composeTagsFilterOptions({ tag }: LocationQuery): FilterOptions {
  return {
    searchKey: 'tags',
    keyword: isString(tag) ? tag : '',
  }
}

function getDefaultFilterOptions(): FilterOptions {
  return {
    searchKey: 'category',
    keyword: '',
  }
}
