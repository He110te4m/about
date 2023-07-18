<script setup lang="ts">
import { type Meta } from '@unhead/vue'
import { description, title } from '~/configs/site'
import { getOpenGraphMeta } from '~/composables/meta/openGraph'
import { getTwitterMeta } from '~/composables/meta/twitter'
import { articles } from '~articles'

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
  <pre>{{ articles }}</pre>
  <div center="full" h="full" w="full">
    <RouterView />
  </div>
</template>
