<script lang="ts" setup>
const pageHTML = useMarkdownRender(`
 An FrontEnd developer
`)
</script>

<template>
  <div v-html="pageHTML" />
</template>
