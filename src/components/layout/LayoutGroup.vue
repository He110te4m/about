<script lang="ts" setup>
import LayoutHeader from './LayoutHeader.vue'
import LayoutFooter from './LayoutFooter.vue'
</script>

<template>
  <div w="full" h="full" flex="~ col" min-h="100vh" overscroll-y="auto">
    <LayoutHeader h="40px" content-bg pos="sticky" top="0" />
    <main py="8" flex="1">
      <slot name="wrapper">
        <div max-w="720px" w="80%" mx="auto" card>
          <slot />
        </div>
      </slot>
    </main>
    <LayoutFooter h="40px" content-bg pos="sticky" bottom="0" />
  </div>
</template>
