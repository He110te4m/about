<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
import { useManualValue } from './useInputValue'

const props = withDefaults(
  defineProps<{
    keyword: string
    disabled?: boolean
  }>(),
  { disabled: false },
)
const emits = defineEmits<{
  (e: 'update:keyword', keyword: string): void
}>()

const text = ref('')
const keyword = useVModel(props, 'keyword', emits)
watchEffect(() => {
  text.value = keyword.value
})

const { change, manualValue } = useManualValue(text)
watchEffect(() => {
  keyword.value = manualValue.value
})
</script>

<template>
  <input
    v-model="text"
    b="1 solid truegray-300" hover:b="blue-500" focus:b="blue-500"
    focus:card-shadow="#3B82F6"
    p="x-2 y-1"
    b-rd="2px"
    lh="4"
    transition="320"
    outline="none"
    autocomplete="none"
    @keydown.enter="change"
  >
</template>
