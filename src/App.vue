<script setup lang="ts">
import { type Meta, useHead } from '@unhead/vue'
import { TravelThroughTheStars } from '~/components/background'
import { description, title } from '~/configs'
import { getOpenGraphMeta } from '~/composables/meta/openGraph'
import { getTwitterMeta } from '~/composables/meta/twitter'
import { LayoutFooter, LayoutHeader } from '~/components/layout'

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
      href: '/favicon.svg',
    },
  ],
})
</script>

<template>
  <LayoutHeader h="40px" content-bg pos="sticky" top="0" />
  <RouterView />
  <LayoutFooter h="40px" content-bg pos="sticky" bottom="0" />

  <ClientOnly>
    <TravelThroughTheStars pos="fixed" z="-1" inset="0" pointer-events="none" />
  </ClientOnly>
</template>
