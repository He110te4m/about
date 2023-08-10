<script setup lang="ts">
import { flow, pipe } from 'fp-ts/lib/function'
import { groupBy } from 'fp-ts/lib/NonEmptyArray'
import { articles } from '~articles/posts'

const route = useRoute()

const filtedArticles = useFilter(
  articles,
  [
    makeKeywordFilter(() => route.query.keyword),
    makeCategoryFilter(() => route.query.category),
  ],
)

const articleGroup = computed(
  () => pipe(
    unref(filtedArticles),
    groupBy<ArticleModule.ArticleInfo>(
      flow(
        prop('createdAt', ''),
        mustDate,
        getYear,
        mustString,
      ),
    ),
  ),
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
