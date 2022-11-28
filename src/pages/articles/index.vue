<script lang="ts" setup>
import { useFilterOptions } from './composables/useFilterOptions'
import type { Article } from '~/components/article'
import type { PagerItem } from '~/components/pager'

// Calculate the list to display
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

// Handle data loading
onMounted(() => {
  const { data } = getArticleList()
  watch(data, (articles = []) => {
    articles.reverse()
    list.value = articles
  })
})

const router = useRouter()
const route = useRoute()
function onChangeCategory(category: string) {
  router.push({
    path: route.path,
    query: {
      category,
    },
  })
}
</script>

<template>
  <ArticleList :list="articleList" @click-category="onChangeCategory" />
  <Pager :page="page" :max-page="maxPage" @jump="onJump" />
</template>
