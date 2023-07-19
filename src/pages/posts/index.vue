<script setup lang="ts">
import { flow } from 'fp-ts/function'
import { useFilter } from '~/composables/filter/useFilter'
import { filterString } from '~/utils/filters/string'
import { mustString } from '~/utils/formatters/string'
import { articles } from '~articles/posts'

const route = useRoute()
const filterKeyword = filterString(mustString(route.query?.keyword))
function prop<A, B extends keyof A>(propName: B) {
  return (data: A) => data[propName]
}

const list = useFilter(
  articles,
  [
    flow(
      prop<ArticleModule.ArticleInfo, 'title'>('title'),
      filterKeyword,
    ),
  ],
)
</script>

<template>
  <ul>
    <li v-for="article in list" :key="article.url">
      <RouteLink :to="article.url">
        {{ article.title }}
      </RouteLink>
    </li>
  </ul>
</template>
