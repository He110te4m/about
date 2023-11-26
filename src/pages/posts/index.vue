<script setup lang="ts">
import { flow, pipe } from 'fp-ts/lib/function'
import { groupBy } from 'fp-ts/lib/NonEmptyArray'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { prop } from '~/utils/filters/record'
import { getYear, mustDate } from '~/utils/formatters/date'
import { mustString } from '~/utils/formatters/string'
import { getPosts } from '~/utils/posts'
import type { PostInfo } from '~posts'

const route = useRoute()

const articleGroup = computed(
  () => {
    const category = mustString(route.query.category, '')
    const keyword = mustString(route.query.keyword, '')

    const posts = getPosts({
      filter: {
        subPath: 'posts',
        category,
        keyword,
      },
      sorter: {
        direction: 'DESC',
      },
    })

    return pipe(
      posts,
      groupBy<PostInfo>(
        flow(
          prop('createdAt', ''),
          mustDate,
          getYear,
          mustString,
        ),
      ),
    )
  },
)
</script>

<template>
  <dl flex="~ col" gap="4" h="full">
    <dd v-for="year in Object.keys(articleGroup).reverse()" :key="year" flex="~ col" items="center">
      <div text="4xl center" group="title" b-y="2" b-color="$separator-color" m-y="4">
        {{ year }}
      </div>
      <div v-for="article in articleGroup[year]" :key="article.url" flex items="start" my="2" p-is="8" lt-md:p-is="1" lt-sm:p-is="0" z="1" w="full">
        <RouterLink v-slot="{ navigate }" :to="article.url" custom>
          <div role="link" cursor="pointer" text="lg" @click="navigate">
            {{ article.title }}
          </div>
        </RouterLink>
      </div>
    </dd>
  </dl>
</template>

<route lang="yaml">
meta:
  layout: Home
</route>
