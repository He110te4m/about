<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterView, useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <main p="x4 y10" text="center teal-700 dark:gray-200">
    <div text-4xl>
      <div i-carbon-warning inline-block />
    </div>
    <RouterView />
    <div>
      <button inline-block cursor="pointer" rounded bg-teal-700 px-4 py-1 text="sm white" hover:bg-teal-800 outline="none!" m="3 t8" @click="router.back()">
        {{ t('button.back') }}
      </button>
    </div>
  </main>
</template>
