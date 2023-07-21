<script setup lang="ts">
import { flow } from 'fp-ts/function'
import { groupBy } from 'fp-ts/NonEmptyArray'
import { useFilter } from '~/composables/filter/useFilter'
import { eqString, filterString } from '~/utils/filters/string'
import { mustString } from '~/utils/formatters/string'
import { prop } from '~/utils/filters/record'
import { articles } from '~articles/posts'
import { anyPass } from '~/utils/filters/boolean'

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

const list = useFilter(
  articles,
  // 支持混合检索
  [
    // 支持关键字检索
    keywordMatcher,
    // 支持分类检索
    categoryMatcher,
  ],
)

const groupByPublishYear = groupBy<ArticleModule.ArticleInfo>(({ createdAt }) => new Date(createdAt).getFullYear().toString())
const group = computed(() => groupByPublishYear(unref(list)))
</script>

<template>
  <dl flex="~ col" items="center" gap="4" h="full">
    <dd v-for="year in Object.keys(group)" :key="year" flex="~ col" items="center" w="full">
      <div>{{ year }}</div>
      <div v-for="article in group[year]" :key="article.url" max-w="720px" w="80%" flex items="center">
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
