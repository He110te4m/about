<script setup lang="ts">
import { articles } from '~articles/posts'
</script>

<template>
  <ul>
    <li v-for="article in articles" :key="article.url">
      <RouteLink :to="article.url">
        {{ article.title }}
      </RouteLink>
    </li>
  </ul>
</template>
