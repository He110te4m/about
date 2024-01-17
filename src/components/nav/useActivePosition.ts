import { type MaybeRef, computed, getCurrentInstance, ref, unref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import type { NavItem as NavItemType } from './types'
import type NavItem from './NavItem.vue'

export function useActivePosition(navs: MaybeRef<NavItemType[]>, els: MaybeRef<(typeof NavItem)[]>) {
  const route = useRoute()
  const left = ref('')
  const width = ref('')

  const vm = getCurrentInstance()
  const parentLeft = computed(() => vm?.proxy?.$el?.getBoundingClientRect().left ?? 0)
  const getPos = makeGetPos(parentLeft)

  watchEffect(() => {
    const list = unref(navs)
    const comps = unref(els)
    if (!route.path || !list.length || comps.length !== list.length) {
      return
    }

    const idx = list.findIndex(item => route.path.startsWith(item.url))
    const el: HTMLElement | undefined = comps[idx]?.$el;

    [left.value, width.value] = getPos(el) ?? [left.value, width.value]
  })

  return {
    left,
    width,
  }
}

function makeGetPos(parentLeft: MaybeRef<number>) {
  return (el?: HTMLElement) => {
    if (!el) {
      return
    }

    const rect = el.getBoundingClientRect()
    const left = `${rect.left - unref(parentLeft)}px`
    const width = `${rect.width}px`

    return [left, width]
  }
}
