<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import type { NavItem as NavItemType } from './types'
import NavItem from './NavItem.vue'
import { useActivePosition } from './useActivePosition'

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

const items = ref<(typeof NavItem)[]>([])
const { left, width } = useActivePosition(navs, items)
</script>

<template>
  <nav
    flex
    gap="4"
    items="center"
    pos="relative"
    class="navigation"
  >
    <NavItem
      v-for="nav in navs"
      :key="nav.url"
      ref="items"
      :nav="nav"
      flex="min"
    />
  </nav>
</template>

<style scoped>
.navigation {
  --left: v-bind(left);
  --width: v-bind(width);
  --at-apply: pos-relative;
}
.navigation:before {
  content: '';
  --at-apply: pos-absolute bottom-0 h-1px bg-$color-primary display-block;
  left: v-bind(left);
  width: v-bind(width);
  transition: left .32s, width .32s;
  will-change: left, width;
}
</style>
