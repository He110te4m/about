<script setup lang="ts">
import type { NavItem } from './types'

defineProps<{
  nav: NavItem
}>()
</script>

<template>
  <RouterLink :to="nav.url" link>
    {{ nav.label }}
  </RouterLink>
</template>
