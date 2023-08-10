<script lang="ts" setup>
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
  <input v-model="text" autocomplete="none" @keydown.enter="change">
</template>
