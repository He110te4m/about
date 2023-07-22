<script lang="ts" setup>
import { articles } from '~articles'

const route = useRoute()
const currentArticle = computed(() => articles.find(({ url }) => route.path === url))
</script>

<template>
  <LayoutGroup>
    <template v-if="currentArticle">
      <h1 text="4xl" font="bold">
        {{ currentArticle.title }}
      </h1>
    </template>
    <RouterView />
  </LayoutGroup>
</template>
