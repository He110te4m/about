<script setup lang="ts">
import { flow, pipe } from 'fp-ts/lib/function'
import { groupBy } from 'fp-ts/lib/NonEmptyArray'
import { articles } from '~articles/posts'

const route = useRoute()

/** 获取检索的关键字 */
const keyword = mustString(route.query?.keyword)
/** 标题检索器 */
const titleMatcher = flow(
  prop('title', ''),
  filterString(keyword),
)
/** 摘要检索器 */
const descMatcher = flow(
  prop('description', ''),
  filterString(keyword),
)
/** 关键词检索器 */
const keywordMatcher = anyPass([
  titleMatcher,
  descMatcher,
])

/** 获取检索的分类 */
const category = mustString(route.query?.category)
/** 分类检索器 */
const categoryMatcher = flow(
  prop('category', ''),
  eqString(category),
)

const filtedArticles = useFilter(
  articles,
  // 支持混合检索
  [
    // 支持关键字检索
    keywordMatcher,
    // 支持分类检索
    categoryMatcher,
  ],
)

const articleGroup = computed(
  () => pipe(
    unref(filtedArticles),
    groupBy<ArticleModule.ArticleInfo>(
      flow(
        prop('createdAt', ''),
        createdAt => new Date(createdAt).getFullYear().toString(),
      ),
    ),
  ),
)
</script>

<template>
  <dl flex="~ col" gap="4" h="full">
    <dd v-for="year in Object.keys(articleGroup).reverse()" :key="year" flex="~ col">
      <div text="8xl left" color="white" text-shadow="md color-gray-600" select="none" pos="relative" op="10">
        {{ year }}
      </div>
      <div v-for="article in articleGroup[year]" :key="article.url" flex items="center" my="4" p-is="16">
        <RouterLink v-slot="{ navigate }" :to="article.url" custom>
          <div role="link" cursor="pointer" text="lg" @click="navigate">
            {{ article.title }}
          </div>
        </RouterLink>
        <div scale="50" b="1 color-gray-500" px="4" b-rd="4">
          {{ article.category }}
        </div>
      </div>
    </dd>
  </dl>
</template>

<route lang="yaml">
meta:
  layout: Home
</route>
