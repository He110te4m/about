<script lang="ts" setup>
import { useMarkdownRender } from '../..'

const mdText = ref('')
const parsedHTML = useMarkdownRender(mdText)
const { textarea, input } = useTextareaAutosize({
  input: mdText,
})
</script>

<template>
  <textarea ref="textarea" v-model="input" border="~ solid color-#ddd" outline="none" resize="none" w="80%" min-h="100px" max-w="800px" />
  <div class="render-result" v-html="parsedHTML" />
</template>
