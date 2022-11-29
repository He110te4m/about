import { T, always, clone, compose, cond, isEmpty, mergeLeft, not, objOf, prop, propOr } from 'ramda'
import type { LocationQuery } from 'vue-router'
import type { Article } from '~/components/article'
import type { ObjectListFilterOptions } from '~/composables/filter'

type FilterOptions = ObjectListFilterOptions<Article, 'category' | 'tags'>

const defaultFilterOptions: FilterOptions = {
  searchKey: 'category',
  keyword: '',
}

/**
 * Transfer the filter state
 */
export function useFilterOptions() {
  const filterOptions = ref<FilterOptions>(clone(defaultFilterOptions))
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
  const hasCategory = compose(not, isEmpty, propOr('', 'category'))
  const categorySearchKeyObj = objOf('searchKey', 'category')
  // @ts-expect-error
  const genOptionsByCategory = compose(
    mergeLeft(categorySearchKeyObj),
    objOf('keyword'),
    prop('category'),
  )

  const hasTag = compose(not, isEmpty, propOr('', 'tag'))
  const tagsSearchKeyObj = objOf('searchKey', 'tags')
  // @ts-expect-error
  const genOptionsByTag = compose(
    mergeLeft(tagsSearchKeyObj),
    objOf('keyword'),
    prop('tag'),
  )

  // @ts-expect-error
  return cond([
    [hasTag, genOptionsByTag],
    [hasCategory, genOptionsByCategory],
    [T, always(clone(defaultFilterOptions))],
  ])(query)
}
