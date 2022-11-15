<script lang="ts" setup>
import { useFilterOptions } from './composables/useFilterOptions'
import type { Article } from '~/components/article'
import type { PagerItem } from '~/composables/pager'

// Calculate the list to display
const list = ref<Article[]>([])
const { filterOptions } = useFilterOptions()
const { list: filteredList } = useObjectListFilter(list, filterOptions)
const limit = ref(5)
const { list: articleList, page, maxPage, jump } = usePage(filteredList, limit)
const { pages } = usePager(page, maxPage)
function onJump(item: PagerItem) {
  if (item.type === 'page') {
    jump(item.value)
  }
}

// Handle data loading
onMounted(() => {
  const { data } = useFetch<Article[]>('blog/articles/list').json()
  watch(data, (articles) => {
    articles.reverse()
    list.value = articles ?? []
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
  <dl flex="~" gap="2" w="full" mt="4" justify="end">
    <dd v-for="(item, idx) in pages" :key="`page-item-${idx}`" w="8" h="8" flex items="center" justify="center" border="~ solid rd-2px" :cursor="item.type === 'sep' ? 'default' : 'pointer'" @click="onJump(item)">
      {{ item.type === 'sep' ? '...' : item.value }}
    </dd>
  </dl>
</template>
