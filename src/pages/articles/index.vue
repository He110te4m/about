<script lang="ts" setup>
import { useArticleList } from './composables/useArticleList'
import type { Article } from '~/apis/article'

// Calculate the list to display
const { list, page, maxPage, onJump } = useArticleList()

const router = useRouter()
const route = useRoute()
function goArticleDetail(id: Article['id']) {
  router.push({
    path: `${route.path}/${id}`,
  })
}
function updateRouteQuery(query: Record<string, string>) {
  router.push({
    path: route.path,
    query,
  })
}

function filterArticleByCategory(category: string) {
  updateRouteQuery({ category })
}
function filterArticleByTag(tag: string) {
  updateRouteQuery({ tag })
}
</script>

<template>
  <ArticleList
    :list="list"
    @click-title="goArticleDetail"
    @click-category="filterArticleByCategory"
    @click-tag="filterArticleByTag"
  />
  <Pager :page="page" :max-page="maxPage" @jump="onJump" />
</template>
