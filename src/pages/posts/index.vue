<script setup lang="ts">
import { flow } from 'fp-ts/function'
import { useFilter } from '~/composables/filter/useFilter'
import { filterString } from '~/utils/filters/string'
import { mustString } from '~/utils/formatters/string'
import { prop } from '~/utils/fp/record'
import { articles } from '~articles/posts'

const route = useRoute()

// 支持关键字检索
const keyword = mustString(route.query?.keyword)
const titleMatcher = flow(
  prop('title', ''),
  filterString(keyword),
)

// 支持分类检索
const category = mustString(route.query?.category)
const categoryMatcher = flow(
  prop('category', ''),
  filterString(category),
)

const list = useFilter(
  articles,
  // 支持混合检索
  [
    titleMatcher,
    categoryMatcher,
  ],
)
</script>

<template>
  <dl flex="~ col" items="center" gap="4">
    <dd v-for="article in list" :key="article.url" max-w="720px" w="80%" flex items="center">
      <RouterLink v-slot="{ navigate }" :to="article.url" custom>
        <div role="link" cursor="pointer" text="lg" @click="navigate">
          {{ article.title }}
        </div>
      </RouterLink>
      <div scale="50" b="1 color-gray-500" px="4" b-rd="4">
        {{ article.category }}
      </div>
    </dd>
  </dl>
</template>
