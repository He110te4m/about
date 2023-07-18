<script lang="ts" setup>
const { t } = useI18n()
</script>

<template>
  <header b-be="color-gray-200 1" px="4" flex justify="between" items="center">
    <div>
      <!-- TODO: 随机内容 -->
    </div>
    <nav flex gap="4">
      <RouterLink to="/articles">
        {{ t('layout.nav.articles') }}
      </RouterLink>
      <RouterLink to="/archives">
        {{ t('layout.nav.archives') }}
      </RouterLink>
    </nav>
  </header>
</template>
