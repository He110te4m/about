<script setup lang="ts">
import type { PostInfo } from '~posts'

defineProps<{
  article: PostInfo
}>()
</script>

<template>
  <div flex items="start" my="2" p-is="8" lt-sm:p-is="1" lt-xs:p-is="0" z="1" w="full">
    <RouterLink v-slot="{ navigate }" :to="article.url" custom>
      <div role="link" cursor="pointer" text="lg" @click="navigate">
        {{ article.title }}
      </div>
    </RouterLink>
  </div>
</template>
