<script lang="ts" setup>
import { articles } from '~articles'

const route = useRoute()
const currentArticle = computed(() => articles.find(({ url }) => route.path === url))
</script>

<template>
  <LayoutGroup>
    <div v-if="currentArticle">
      {{ currentArticle.title }}
    </div>
    <RouterView />
  </LayoutGroup>
</template>
