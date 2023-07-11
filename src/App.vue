<script setup lang="ts">
import { type Meta } from '@unhead/vue'
import { description, title } from '~/configs/site'
import { getOpenGraphMeta } from '~/utils/meta/openGraph'
import { getTwitterMeta } from '~/utils/meta/twitter'

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
