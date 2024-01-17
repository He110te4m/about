<script setup lang="ts">
import { flow, pipe } from 'fp-ts/lib/function'
import { groupBy } from 'fp-ts/lib/NonEmptyArray'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { prop } from '~/utils/filters/record'
import { getYear, mustDate } from '~/utils/formatters/date'
import { mustString } from '~/utils/formatters/string'
import { getPosts } from '~/utils/posts'
import type { PostInfo } from '~posts'
import { ArticlePreview } from '~/components/article'

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

const { t } = useI18n()
</script>

<template>
  <div h-full>
    <dl v-if="Object.keys(articleGroup).length" flex="~ col" gap="4" h="full">
      <dd v-for="year in Object.keys(articleGroup).reverse()" :key="year" flex="~ col" items="center">
        <div text="4xl center" group="title" b-y="2" b-color="$separator-color" m-y="4">
          {{ year }}
        </div>
        <ArticlePreview v-for="article in articleGroup[year]" :key="article.url" :article="article" />
      </dd>
    </dl>
    <div v-else h-full flex items="center" justify="center">
      {{ t('page.article.empty') }}
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: Home
</route>
