<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import SearchField from '~/components/form/SearchField/index.vue'
import { mustString } from '~/utils/formatters/string'

const { t } = useI18n()
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
  <header b-be="color-$separator-color 1" px="4" font="5" flex justify="between" items="center">
    <div>
      <!-- TODO: 随机内容 -->
    </div>
    <nav flex gap="4" items="center">
      <RouterLink to="/posts" link flex="min">
        {{ t('layout.nav.articles') }}
      </RouterLink>
      <RouterLink to="/archives" link flex="min">
        {{ t('layout.nav.archives') }}
      </RouterLink>
      <RouterLink to="/AboutMe" link flex="min">
        {{ t('layout.nav.aboutme') }}
      </RouterLink>
      <SearchField v-model:keyword="keyword" lt-sm:flex="1" />
    </nav>
  </header>
</template>
