import { useFilterOptions } from './useFilterOptions'
import type { Article } from '~/apis/article'
import type { PagerItem } from '~/components/pager'

export function useArticleList() {
  const list = ref<Article[]>([])

  const { filterOptions } = useFilterOptions()
  const { list: filteredList } = useObjectListFilter(list, filterOptions)
  const limit = ref(5)
  const { list: articleList, page, maxPage, jump } = usePage(filteredList, limit)
  function onJump(item: PagerItem) {
    if (item.type === 'page') {
      jump(item.value)
    }
  }

  onMounted(() => {
    const { data } = getArticleList()
    watch(data, (articles) => {
      articles?.reverse()
      list.value = articles ?? list.value
    })
  })

  return { list: articleList, page, maxPage, onJump }
}
