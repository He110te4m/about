<script lang="ts" setup>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import AppBackground from './AppBackground.vue'
</script>

<template>
  <div flex="~ col" items="center" h="full" max-h="full">
    <AppHeader flex-none />
    <main font-sans text="center gray-700 dark:gray-200" max-w="800px" w="80%" mx="auto" flex="1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
  <AppBackground />
</template>
