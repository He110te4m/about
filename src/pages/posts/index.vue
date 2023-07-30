<script setup lang="ts">
import { flow, pipe } from 'fp-ts/lib/function'
import { nonEmptyArray as NonEmptyArray } from 'fp-ts'
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
    NonEmptyArray.groupBy<ArticleModule.ArticleInfo>(
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
