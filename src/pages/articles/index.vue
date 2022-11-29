<script lang="ts" setup>
import { useArticleList } from './composables/useArticleList'

// Calculate the list to display
const { list, page, maxPage, onJump } = useArticleList()

const router = useRouter()
const route = useRoute()
function updateRouteQuery(query: Record<string, string>) {
  router.push({
    path: route.path,
    query,
  })
}

function onClickCategory(category: string) {
  updateRouteQuery({ category })
}
function onClickTag(tag: string) {
  updateRouteQuery({ tag })
}
</script>

<template>
  <ArticleList :list="list" @click-category="onClickCategory" @click-tag="onClickTag" />
  <Pager :page="page" :max-page="maxPage" @jump="onJump" />
</template>
