import type { Article } from '~/components/article'
import type { ObjectListFilterOptions } from '~/composables/filter'

/**
 * Transfer the filter state
 */
export function useFilterOptions() {
  const filterOptions = ref<ObjectListFilterOptions<Article, 'category'>>({
    searchKey: 'category',
    keyword: '',
  })
  const route = useRoute()
  watch(
    () => route.query.category,
    cate => filterOptions.value.keyword = typeof cate == 'string' ? cate : '',
    { immediate: true },
  )

  return {
    filterOptions,
  }
}
