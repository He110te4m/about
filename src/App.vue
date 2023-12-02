<script setup lang="ts">
import { type Meta, useHead } from '@unhead/vue'
import { RouterView, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAnimaterStore } from './stores/animater'
import StarAnimater from '~/components/animation/star/index.vue'
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

const router = useRouter()
const { animater } = storeToRefs(useAnimaterStore())
router.beforeEach(() => {
  animater.value?.fast()
})
router.afterEach(() => {
  animater.value?.slow()
})
</script>

<template>
  <div id="app" pos="relative">
    <RouterView />
    <ClientOnly>
      <StarAnimater pos="absolute" z="-1" inset="0" />
    </ClientOnly>
  </div>
</template>
