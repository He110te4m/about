import Vue from 'vue'
import { getCurrentInstance } from 'vue-demi'
import type { AnyObject, Mixin } from '../types'
import { createProxy } from '../utils'
import { convertComputed } from './computed'
import { convertData } from './data'
import { convertInjectData } from './inject'
import { convertLifeCycle } from './lifeCycle'
import { convertMethods } from './methods'
import { convertProvideData } from './provide'
import { convertWatch } from './watch'
import { convertComponentConfig } from './config'
import { convertProps } from './props'

export function convertMixin(mixin?: Mixin) {
  const component: any = (mixin && 'prototype' in mixin && mixin.prototype instanceof Vue)
    ? mixin
    : Vue.extend(mixin) // 使用 vue.extend 创建一个组件，让 vue 进行 options 合并

  // 获取合并后的 options
  const componentData: Mixin = { ...component.options }

  const vm = getCurrentInstance()

  // 使用 proxy 处理 vue options function this 指向问题
  const proxy = createProxy(
    componentData,
    () => {
      const obj: AnyObject = {}

      // 将全局的注册的函数挂载到代理对象上
      Object.keys(vm?.proxy ?? {}).forEach((key) => {
        if (key.startsWith('$')) {
          obj[key] = vm?.proxy[key] ?? {}
        }
      })

      obj.$options = componentData

      return obj
    },
  )

  // 转换 mixin 中的组件配置，如： name、inheritAttrs
  convertComponentConfig(componentData)

  // 转换 mixin 中的 props 选项
  const propsData = convertProps(componentData)
  componentData.propsData = propsData

  // 转换 mixin inject 选项
  const inject = convertInjectData(componentData)
  componentData.inject = inject

  // 转换 mixin data 选项
  const data = convertData(componentData)
  componentData.data = data

  // 转换 mixin computed 选项
  const computed = convertComputed(componentData, proxy)
  componentData.computed = computed

  // 转换 mixin methods 选项
  const methods = convertMethods(componentData, proxy)
  componentData.methods = methods

  // 转换 mixin provide 选项
  convertProvideData(componentData, proxy)

  // 转换 mixin watch 选项
  convertWatch(componentData, proxy)

  // 转换 mixin 生命周期 hook
  convertLifeCycle(componentData, proxy)

  return proxy
}
