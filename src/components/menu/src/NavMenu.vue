<script lang="ts" setup>
import type { NavMenuDataSource } from './types'
import { useNavConfig } from './composables/useNavConfig'

const { title, options = [] } = defineProps<{
  title: string
  options?: NavMenuDataSource[]
}>()

const config = useNavConfig(options)
</script>

<template>
  <Menu as="nav" class="components-nav-menu">
    <template #default="defaultSlotParams">
      <slot name="button" v-bind="defaultSlotParams">
        <MenuButton class="components-nav-menu__title">
          {{ title }}
        </MenuButton>
      </slot>

      <slot name="list" v-bind="defaultSlotParams">
        <NavSubMenu v-for="item in config" :key="item.key" :menu-data="item" :open="defaultSlotParams.open">
          <template #default="{ navTitle }">
            <a>{{ navTitle }}</a>
          </template>
        </NavSubMenu>
      </slot>
    </template>
  </Menu>
</template>

<style>
.components-nav-menu .components-nav-menu__title {
  border: 1px solid #ddd;
  padding: 8px 16px;
}
</style>
