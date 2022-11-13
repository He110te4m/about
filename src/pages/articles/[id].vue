<script lang="ts" setup>
const route = useRoute()
const id = computed(() => route.params.id)
</script>

<template>
  {{ id }}
</template>
