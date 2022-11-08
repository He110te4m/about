<script lang="ts" setup>
import type { Article as ArticleType } from './types'

const { article } = defineProps<{
  article: ArticleType
}>()

const emitters = defineEmits<{
  (e: 'click-title', articleID: ArticleType['id']): void
}>()

function onTitleClick() {
  emitters('click-title', article.id)
}
</script>

<template>
  <article class="components-article-card">
    <header class="components-article-card__header">
      <a class="components-article-card__header__title" @click="onTitleClick">
        {{ article.title }}
      </a>
    </header>
    <section class="components-article-card__content">
      article content
    </section>
    <footer class="components-article-card__footer">
      footer
    </footer>
  </article>
</template>

<style>
.components-article-card {
  border: 1px solid #ddd;
  padding: 0 var(--size-3xl);
  background-color: var(--background);
  border-radius: var(--size-xs);
  box-shadow: 0 0 var(--size-xs) #ddd;
  transition: box-shadow .5s;
}
.components-article-card:hover {
  box-shadow: 0 var(--size-sm) var(--size-3xl) #ddd;
}

.components-article-card__header,
.components-article-card__content,
.components-article-card__footer {
  padding: var(--horizontal-padding-sm);
}
.components-article-card__content {
  --border: 1px solid var(--card-border-color);
  border-top: var(--border);
  border-bottom: var(--border);
}
.components-article-card__header__title {
  font-size: var(--font-xl);
}
</style>
