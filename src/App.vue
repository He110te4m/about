<script setup lang="ts">
import { type Meta, useHead } from '@unhead/vue'
import { RouterView } from 'vue-router'
import { description, title } from '~/configs/site'
import { preferredDark } from '~/composables/dark'
import { getOpenGraphMeta } from '~/composables/meta/openGraph'
import { getTwitterMeta } from '~/composables/meta/twitter'

const info = { title, description }

const baseMeta: Meta[] = [
  { name: 'description', content: description },
]

useHead({
  title,
  meta: baseMeta.concat(
    getOpenGraphMeta(info),
    getTwitterMeta(info),
  ),
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})
</script>

<template>
  <RouterView />
</template>
