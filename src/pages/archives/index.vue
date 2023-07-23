<script lang="ts" setup>
import { nonEmptyArray as NonEmptyArray, number as Number, option as Option, ord as Ord } from 'fp-ts'
import { constant, flow, pipe } from 'fp-ts/lib/function'
import { articles } from '~articles/archives'

/** series.order 排序器，以数字从小到大为序 */
const sortBySeriesOrder = pipe(
  Number.Ord,
  Ord.contramap(
    flow(
      prop('series', {}),
      prop('order', -1),
    ),
  ),
)

/** 排序分组后的数据 */
const series = pipe(
  NonEmptyArray.fromArray(articles),
  // 判断数组是否有值
  Option.match(
    // 数组没有内容，直接返回默认值
    constant({} as Record<string, NonEmptyArray.NonEmptyArray<ArticleModule.ArticleInfo>>),
    // 处理有长度的场景
    flow(
      // 有值时先排序，按 series.order 排序
      NonEmptyArray.sortBy([
        sortBySeriesOrder,
      ]),
      // 排序后原地分组，以 series.title 为 key 分组
      NonEmptyArray.groupBy<ArticleModule.ArticleInfo>(
        flow(
          prop('series', {}),
          prop('title', ''),
        ),
      ),
    ),
  ),
)
</script>

<template>
  <template v-for="name in Object.keys(series)" :key="name">
    <div text="4xl" mb="4">
      {{ name }}
    </div>
    <ol class="order">
      <li v-for="article in series[name]" :key="name + article.url">
        <RouterLink v-slot="{ navigate }" :to="article.url" custom>
          <div role="link" cursor="pointer" text="lg" @click="navigate">
            {{ article.title }}
          </div>
        </RouterLink>
      </li>
    </ol>
  </template>
</template>
