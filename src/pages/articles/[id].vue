<script lang="ts" setup>
import { useArticle } from './composables/useArticle'

const route = useRoute()
const id = computed(() => {
  const id = route.params.id
  return isString(id) ? id : ''
})
const { article } = useArticle(id)
const content = useMarkdownRender(() => article.value?.content ?? '')
</script>

<template>
  <article v-if="article">
    <header>{{ article.title }}</header>
    <section class="typography" v-html="content" />
  </article>
</template>
