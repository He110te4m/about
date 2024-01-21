<script lang="ts" setup>
import { nonEmptyArray as NonEmptyArray, number as Number, option as Option, ord as Ord } from 'fp-ts'
import { constant, flow, pipe } from 'fp-ts/lib/function'
import { ArticlePreview } from '~/components/article'
import { prop } from '~/utils/filters/record'
import { getTime, mustDate } from '~/utils/formatters/date'
import { getPosts } from '~/utils/posts'
import { type PostInfo } from '~posts'

/** article 排序器，以数字从小到大为序 */
const sortByCreatedAt = pipe(
  Number.Ord,
  Ord.contramap(
    flow(
      prop('createdAt', ''),
      mustDate,
      getTime,
    ),
  ),
)

const posts = getPosts({
  filter: { subPath: 'archives' },
  sorter: { direction: 'DESC' },
})

/** 排序分组后的数据 */
const series = pipe(
  NonEmptyArray.fromArray(posts),
  // 判断数组是否有值
  Option.match(
    // 数组没有内容，直接返回默认值
    constant({} as Record<string, NonEmptyArray.NonEmptyArray<PostInfo>>),
    // 处理有长度的场景
    flow(
      // 有值时先排序，按 series.order 排序
      NonEmptyArray.sortBy([
        sortByCreatedAt,
      ]),
      // 排序后原地分组，以 series.title 为 key 分组
      NonEmptyArray.groupBy<PostInfo>(
        prop('series', ''),
      ),
    ),
  ),
)
</script>

<template>
  <template v-for="name in Object.keys(series)" :key="name">
    <div text="4xl center" m-be="4">
      {{ name }}
    </div>
    <ol class="order" p-is="8" lt-sm:p-is="4">
      <li v-for="article in series[name]" :key="name + article.url">
        <ArticlePreview :article="article" />
      </li>
    </ol>
  </template>
</template>

<route lang="yaml">
meta:
  layout: Home
</route>
