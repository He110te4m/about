<script lang="ts" setup>
import type { PagerItem } from './usePager'

const props = defineProps<{
  maxPage: number
  page: number
}>()

const emit = defineEmits<{
  (eventName: 'jump', item: PagerItem): void
}>()

const { maxPage, page } = toRefs(props)

const { pages } = usePager(page, maxPage)

function onJump(page: PagerItem) {
  emit('jump', page)
}
</script>

<template>
  <dl class="components-pager">
    <dd
      v-for="(item, idx) in pages" :key="`page-item-${idx}`" class="components-pager__item" :class="{
        'active': item.type === 'page' && item.value === page,
        'no-click': item.type === 'sep' || item.value === page,
      }" @click="onJump(item)"
    >
      {{ item.type === 'sep' ? '...' : item.value }}
    </dd>
  </dl>
</template>

<style>
.components-pager {
  display: flex;
  justify-content: flex-end;
  gap: var(--size-sm);
  width: 100%;
  margin-top: var(--size-md);
}

.components-pager__item {
  display: flex;
  align-items: center;
  justify-content: center;

  width: var(--size-4xl);
  height: var(--size-4xl);

  border: 1px solid #ddd;
  cursor: pointer;
  color: var(--text-description-color);

  transition: color, border-color .5s;
}

.components-pager__item:hover {
  border-color: var(--text-secondary-color);
  color: var(--text-secondary-color);
}

.components-pager__item.active {
  border-color: var(--text-primary-color);
  color: var(--text-primary-color);
}

.components-pager__item.no-click {
  cursor: default;
}
</style>
