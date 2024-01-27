<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
import { useManualValue } from './useManualValue'

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
    b="1 solid $separator-color" hover:b="$color-primary" focus:b="$color-primary"
    focus:card-shadow="$color-primary"
    p="x-2 y-1"
    b-rd="2px"
    lh="4"
    w="140px" lt-sm:display="none"
    transition="320"
    outline="none"
    autocomplete="none"
    @keydown.enter="change"
  >
</template>
