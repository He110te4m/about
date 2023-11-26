<script lang="ts" setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import LayoutGroup from '~/components/layout/LayoutGroup.vue'
import { posts } from '~posts'

const route = useRoute()
const currentArticle = computed(() => posts.find(({ url }) => route.path === url))
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
