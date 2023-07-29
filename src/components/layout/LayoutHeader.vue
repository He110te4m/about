<script lang="ts" setup>
const { t } = useI18n()
</script>

<template>
  <header b-be="color-sep 1" px="4" font="5" flex justify="between" items="center">
    <div>
      <!-- TODO: 随机内容 -->
    </div>
    <nav flex gap="4">
      <RouterLink to="/posts" link>
        {{ t('layout.nav.articles') }}
      </RouterLink>
      <RouterLink to="/archives" link>
        {{ t('layout.nav.archives') }}
      </RouterLink>
    </nav>
  </header>
</template>
