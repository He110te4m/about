<script lang="ts" setup>
import type { ExtractMarkdownSummaryOptions } from '../..'
import { useMarkdownSummary } from '../..'

const mdText = ref(`
# title1

> reference to Marked

## title1-1

This is the **content**, and some *info*

# title2

This is the second content, and a [link](https://me.he110.site)
`)
const options = ref<ExtractMarkdownSummaryOptions>({
  includeTitle: false,
  paragraphNum: 1,
})
const summaryHTML = useMarkdownSummary(mdText, options)
const { textarea, input } = useTextareaAutosize({
  input: mdText,
})
</script>

<template>
  <div>
    <input id="includeTitle" v-model="options.includeTitle" type="checkbox" mr="2">
    <label for="includeTitle">includeTitle</label>
  </div>
  <div>
    <input v-model="options.paragraphNum" border="~ solid color-#ddd" my="2" type="number">
  </div>
  <textarea
    ref="textarea" v-model="input" border="~ solid color-#ddd" outline="none" resize="none" w="80%"
    min-h="100px" max-w="800px"
  />
  <div class="render-result" v-html="summaryHTML" />
</template>
