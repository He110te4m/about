<script lang="ts" setup>
import { author } from '~/configs'
</script>

<template>
  <footer text="sm" color="$title-color" p="x-4 y-2" w="full" h-full flex content-bg justify="center" items="center" b-bs="color-$separator-color 1" select="none">
    copyright © <a href="https://me.he110.site" link m-is="2">{{ author }}</a>
  </footer>
</template>
