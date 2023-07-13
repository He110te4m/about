<script setup lang="ts">
import { title } from '~/configs/site'

function close() {
  window.location.href = 'about:blank'
  window.close()
}
</script>

<template>
  <div wrapper>
    <header flex justify="between" items="center" lh="10" border="b color-gray-300" px="4">
      <div>{{ title }}</div>
      <i i-carbon-close-filled cursor="pointer" bg="red-600" @click="close" />
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>
