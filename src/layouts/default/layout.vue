<script lang="ts" setup>
import AppFooter from './AppFooter.vue'
import AppBackground from './AppBackground.vue'
</script>

<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200" max-w="800px" w="80%" mx="auto">
    <RouterView />
  </main>
  <AppFooter />
  <AppBackground />
</template>
