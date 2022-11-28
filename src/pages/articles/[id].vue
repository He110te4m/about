<script lang="ts" setup>
import { useArticle } from './composables/useArticle'

const route = useRoute()
const id = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : ''
})
const { article } = useArticle(id)
</script>

<template>
  {{ article?.content ?? '' }}
</template>
