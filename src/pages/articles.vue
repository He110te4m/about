<script lang="ts" setup>
import { useFilterOptions } from './_articles/useFilterOptions'
import type { Article } from '~/components/article'

// Calculate the list to display
const list = ref<Article[]>([])
const { filterOptions } = useFilterOptions()
const { list: filteredList } = useObjectListFilter(list, filterOptions)
const limit = ref(5)
const { list: articleList } = usePage(filteredList, limit)

// Handle data loading
onMounted(() => {
  const { data } = useFetch<Article[]>('blog/articles/list').json()
  watch(data, (articles) => {
    articles.reverse()
    list.value = articles ?? []
  })
})
</script>

<template>
  <ArticleList :list="articleList" />
</template>
