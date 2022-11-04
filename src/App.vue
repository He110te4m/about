<script lang="ts" setup>
import AppFooter from '~/components/AppFooter.vue'
import AppBackground from '~/components/AppBackground.vue'
</script>

<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <RouterView />
    <AppFooter />
    <AppBackground />
  </main>
</template>
