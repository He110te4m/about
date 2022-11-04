import type { MaybeRef } from '@vueuse/core'
import type { NavMenuDataSource } from '../types'

export function useNavConfig(options: MaybeRef<NavMenuDataSource[]>) {
  return computed(() => formattedNavConfig(unref(options)))
}

function formattedNavConfig(options: NavMenuDataSource[]) {
  options.forEach((item) => {
    if (!item.type) {
      item.type = 'nav'
    }

    if (!item.key) {
      const key = item.type === 'nav' ? (item.title ?? 'nav-menu') : 'nav-menu'
      item.key = Symbol(key)
    }

    if (item.type === 'nav') {
      if (item.children) {
        item.children = formattedNavConfig(item.children)
      }
    }
  })

  return options
}
