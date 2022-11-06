<script lang="ts" setup>
import type { Article } from './types'

const { list } = defineProps<{
  list: Article[]
}>()
</script>

<template>
  <dl class="components-article-list">
    <dd v-for="article in list" :key="article.id" class="components-article-list__article">
      <ArticleCard class="components-article-list__article__card" :article="article" />
    </dd>
  </dl>
</template>

<style scoped>
.components-article-list__article + .components-article-list__article {
  margin-top: var(--gap-lg);
}
</style>
