<script lang="ts" setup>
import type { Article as ArticleType } from './types'

type Tag = Required<ArticleType>['tags'][number]

const { article } = defineProps<{
  article: ArticleType
}>()
const emitters = defineEmits<{
  (e: 'click-title', articleID: ArticleType['id']): void
  (e: 'click-category', category: ArticleType['category']): void
  (e: 'click-tag', tag: Tag): void
}>()

const createdTime = useDateFormat(() => article.createdAt, 'YYYY-MM-DD')
const updatedTime = useDateFormat(() => article.updatedAt, 'YYYY-MM-DD')

function onTitleClick() {
  emitters('click-title', article.id)
}

function onCategoryClick() {
  emitters('click-category', article.category)
}

function onTagClick(tag: Tag) {
  emitters('click-tag', tag)
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
      {{ article.content }}
    </section>
    <footer class="components-article-card__footer">
      <div class="components-article-card__footer__category" @click="onCategoryClick">
        {{ article.category }}
      </div>
      <div class="components-article-card__footer__created-time">
        {{ createdTime }}
      </div>
      <div v-show="article.tags?.length" class="components-article-card__footer__tags">
        <a
          v-for="tag in article.tags" :key="tag" class="components-article-card__footer__tags__item"
          @click="onTagClick(tag)"
        >{{ tag }}</a>
      </div>
      <div v-show="article.updatedAt" class="components-article-card__footer__updated-time">
        {{ updatedTime }}
      </div>
    </footer>
  </article>
</template>

<style>
/* wrapper */
.components-article-card {
  border: 1px solid #2BBBFF;
  padding: 0 var(--size-3xl);
  background-color: var(--background);
  border-radius: var(--size-xs);
  box-shadow: 0 0 var(--size-xs) #2BBBFF66;
  transition: box-shadow .5s;
}
.components-article-card:hover {
  box-shadow: 0 var(--size-sm) var(--size-xl) #2BBBFF33;
}

/* layout */
.components-article-card__header,
.components-article-card__content,
.components-article-card__footer {
  padding: var(--horizontal-padding-sm);
}

/* header */
.components-article-card__header__title {
  font-size: var(--font-xl);
  cursor: pointer;
}

/* content */
.components-article-card__content {
  --border: 1px solid var(--card-border-color);
  border-top: var(--border);
  border-bottom: var(--border);
}

/* footer */
.components-article-card__footer {
  display: flex;
  flex-wrap: wrap;
}
.components-article-card__footer__category,
.components-article-card__footer__tags,
.components-article-card__footer__created-time,
.components-article-card__footer__updated-time {
  flex: 0 1 50%;
}
.components-article-card__footer__tags__item,
.components-article-card__footer__category {
  cursor: pointer;
}
</style>
