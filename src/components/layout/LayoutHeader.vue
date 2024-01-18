<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SearchField } from '~/components/form/search'
import { mustString } from '~/utils/formatters/string'
import { NavList } from '~/components/nav'

const route = useRoute()
const router = useRouter()
const keyword = ref(mustString(route.query.keyword))
watch(
  keyword,
  (keyword) => {
    router.push({
      path: route.path,
      query: {
        ...route.query,
        keyword,
      },
    })
  },
)
</script>

<template>
  <header b-be="color-$separator-color 1" px="4" font="5" flex items="center">
    <div flex="1">
      <!-- TODO: 随机内容 -->
    </div>
    <NavList />
    <SearchField v-model:keyword="keyword" w="160px" ml="4" />
  </header>
</template>
