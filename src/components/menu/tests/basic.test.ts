import { type MountingOptions, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { NavMenu, type NavMenuProps } from '..'

describe('basic render', () => {
  it('render title', () => {
    const randomNum = Math.random()
    const title = `NavMenu title - ${randomNum}`

    const wrapper = getMountedComp({ props: { title } })

    const titleEl = wrapper.find('.components-nav-menu__title')

    expect(titleEl).toBeTruthy()
    expect(titleEl.text()).toBe(title)
  })
})

function getMountedComp(options: MountingOptions<NavMenuProps>) {
  return mount(NavMenu, options)
}
