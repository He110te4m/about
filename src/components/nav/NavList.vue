<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import type { NavItem as NavItemType } from './types'
import NavItem from './NavItem.vue'

const { t } = useI18n()

const navs: NavItemType[] = [
  {
    url: '/posts',
    label: t('layout.nav.articles'),
  },
  {
    url: '/archives',
    label: t('layout.nav.archives'),
  },
  {
    url: '/AboutMe',
    label: t('layout.nav.aboutme'),
  },
]
</script>

<template>
  <nav flex gap="4" items="center">
    <NavItem v-for="nav in navs" :key="nav.url" :nav="nav" flex="min" />
  </nav>
</template>
