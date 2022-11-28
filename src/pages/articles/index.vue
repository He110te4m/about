<script lang="ts" setup>
import { useArticleList } from './composables/useArticleList'

// Calculate the list to display
const { list, page, maxPage, onJump } = useArticleList()

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
  <ArticleList :list="list" @click-category="onChangeCategory" />
  <Pager :page="page" :max-page="maxPage" @jump="onJump" />
</template>
