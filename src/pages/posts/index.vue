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
  <dl flex="~ col" items="center" gap="4">
    <dd v-for="article in list" :key="article.url" max-w="720px" w="80%" b="1 color-gray-300" shadow="md color-gray-500">
      <RouterLink v-slot="{ navigate }" :to="article.url" custom>
        <div role="link" cursor="pointer" px="4" py="2" b-be="1 color-gray-200" @click="navigate">
          {{ article.title }}
        </div>
        <div flex justify="between" px="4" py="2">
          <div>
            {{ article.category }}
          </div>
          <RouterLink :to="article.url">
            阅读全文
          </RouterLink>
        </div>
      </RouterLink>
    </dd>
  </dl>
</template>
