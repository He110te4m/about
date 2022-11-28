<script lang="ts" setup>
import type { Article } from '~/apis/article'

const { list } = defineProps<{
  list: Article[]
}>()

// binding article event
const attrs = useAttrs()
</script>

<template>
  <dl class="components-article-list">
    <dd v-for="article in list" :key="article.id" class="components-article-list__article">
      <slot :article="article">
        <ArticleCard class="components-article-list__article__card" :article="article" v-bind="attrs" />
      </slot>
    </dd>
  </dl>
</template>

<style>
.components-article-list__article + .components-article-list__article {
  margin-top: var(--gap-lg);
}
</style>
