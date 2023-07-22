<script lang="ts" setup>
import { groupBy } from 'fp-ts/lib/NonEmptyArray'
import { articles } from '~articles/archives'

const series = groupBy<ArticleModule.ArticleInfo>(({ series }) => series?.title ?? '')(articles)
</script>

<template>
  <dl v-for="name in Object.keys(series)" :key="name">
    <div>{{ name }}</div>
    <dd v-for="article in series[name]" :key="article.url">
      {{ article.title }}
    </dd>
  </dl>
</template>
