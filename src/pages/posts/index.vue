<script setup lang="ts">
import { flow } from 'fp-ts/function'
import { useFilter } from '~/composables/filter/useFilter'
import { filterString } from '~/utils/filters/string'
import { mustString } from '~/utils/formatters/string'
import { prop } from '~/utils/fp/record'
import { articles } from '~articles/posts'

const route = useRoute()
const keyword = mustString(route.query?.keyword)
const titleMatcher = flow(
  prop('title'),
  filterString(keyword),
)

const list = useFilter(
  articles,
  [
    titleMatcher,
  ],
)
</script>

<template>
  <ul>
    <li v-for="article in list" :key="article.url">
      <RouterLink :to="article.url">
        {{ article.title }}
      </RouterLink>
    </li>
  </ul>
</template>
