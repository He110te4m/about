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
    <slot name="button">
      <MenuButton class="components-nav-menu__title">
        {{ title }}
      </MenuButton>
    </slot>

    <slot name="list">
      <template v-for="item in config">
        <MenuItems v-if="item.type === 'nav'" :key="item.title" as="dl" class="components-nav-menu__navs">
          <MenuItem as="dd" class="components-nav-menu__navs__item">
            <slot>
              <a class="components-nav-menu__navs__item--link">menu item</a>
            </slot>
          </MenuItem>
        </MenuItems>
      </template>
    </slot>
  </Menu>
</template>
