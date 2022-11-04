<script lang="ts" setup>
import type { NavMenuDataSource } from '../..'

const options: NavMenuDataSource[] = [
  {
    type: 'nav',
    children: [
      { type: 'nav', title: 'test nav group 1-1' },
      { type: 'nav', title: 'test nav group 1-2' },
    ],
  },
  { type: 'sep' },
  {
    type: 'nav',
    children: [
      { type: 'nav', title: 'test nav group 2-1' },
      { type: 'nav', title: 'test nav group 2-2' },
    ],
  },
]
</script>

<template>
  <NavMenu title="show `NavMenu` basic usage" :options="options" />
</template>
