<script lang="ts" setup>
import type { NavMenuDataSource } from './types'

const { menuData, classPrefix = 'components-nav-menu', open } = defineProps<{
  menuData: NavMenuDataSource
  open: boolean
  classPrefix?: string
}>()
</script>

<script lang="ts">
export default defineComponent({
  name: 'NavSubMenu',
})
</script>

<template>
  <template v-if="menuData.type === 'nav'">
    <MenuItems v-if="menuData.children" :class="`${classPrefix}__navs`">
      <NavSubMenu v-for="item in menuData.children" :key="item.key" :menu-data="item" :class-prefix="classPrefix" :open="open">
        <template #default="defaultParams">
          <slot v-bind="defaultParams" />
        </template>
      </NavSubMenu>
    </MenuItems>
    <MenuItem v-if="menuData.title" :class="`${classPrefix}__navs__item`">
      <template #default="defaultParams">
        <slot v-bind="defaultParams" :nav-title="menuData.title" />
      </template>
    </MenuItem>
  </template>
  <hr v-else-if="open && menuData.type === 'sep'" :class="`${classPrefix}__sep`">
</template>
