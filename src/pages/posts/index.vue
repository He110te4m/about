<script setup lang="ts">
import { useFilter } from '~/composables/filter/useFilter'
import { filterTitle } from '~/utils/filters/article'
import { mustString } from '~/utils/formatters/string'
import { articles } from '~articles/posts'

const route = useRoute()
const keyword = mustString(route.query?.keyword)

const list = useFilter(
  articles,
  [
    filterTitle(keyword),
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
