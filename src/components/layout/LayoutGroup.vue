<script lang="ts" setup>
import LayoutHeader from './LayoutHeader.vue'
import LayoutFooter from './LayoutFooter.vue'
import StarAnimater from '~/components/animation/star/index.vue'
</script>

<template>
  <div w="full" h="full" flex="~ col" pos="relative">
    <LayoutHeader h="40px" content-bg />
    <main py="8" overflow="y-auto" flex="1">
      <slot name="wrapper">
        <div max-w="720px" w="80%" mx="auto" min-h="full" card>
          <slot />
        </div>
      </slot>
    </main>
    <LayoutFooter h="40px" content-bg />
    <StarAnimater pos="absolute" z="-1" inset="0" />
  </div>
</template>
