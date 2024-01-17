<script setup lang="ts">
import { type Meta, useHead } from '@unhead/vue'
import { RouterView, useRouter } from 'vue-router'
import { useAnimater } from '~/composables/animate'
import StarAnimater from '~/components/animation/star/index.vue'
import { description, title } from '~/configs'
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
  <div pos="relative">
    <RouterView />
    <ClientOnly>
      <StarAnimater pos="fixed" z="-1" inset="0" pointer-events="none" />
    </ClientOnly>
  </div>
</template>
