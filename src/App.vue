<script setup lang="ts">
import { type Meta, useHead } from '@unhead/vue'
import { RouterView, useRouter } from 'vue-router'
import { useAnimater } from '~/composables/animate'
import StarAnimater from '~/components/animation/star/index.vue'
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

const router = useRouter()
const { goFast, goSlow } = useAnimater()
router.beforeEach(() => {
  goFast()
})
router.afterEach(() => {
  goSlow()
})
</script>

<template>
  <LayoutHeader h="40px" content-bg pos="sticky" top="0" />
  <RouterView />
  <LayoutFooter h="40px" content-bg pos="sticky" bottom="0" />

  <ClientOnly>
    <StarAnimater pos="fixed" z="-1" inset="0" pointer-events="none" />
  </ClientOnly>
</template>
