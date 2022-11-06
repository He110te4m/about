<script lang="ts" setup>
import list from '~/../public/blog/articles/list.json'
</script>

<template>
  <div class="demo-article">
    <ArticleList :list="list.data" />
  </div>
</template>

<style scoped>
.demo-article {
  width: 80%;
  max-width: 800px;
  margin: 0 auto;
}
</style>
