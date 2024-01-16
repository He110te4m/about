import { getCurrentInstance, reactive, set, watchEffect } from 'vue-demi'
import type { AnyObject, Mixin } from '../types'

export function convertProps(mixin: Mixin) {
  const propsData = reactive({})
  const vm = getCurrentInstance()
  if (!vm || !mixin.props) {
    return propsData
  }

  const mixinPropKeys = Object.keys(mixin.props)
  const defaultCache = mixinPropKeys.reduce((obj, prop) => {
    obj[prop] = getDefault(mixin.props[prop])
    return obj
  }, {} as AnyObject)
  watchEffect(() => {
    const attrs = formatAttrs(vm.proxy.$attrs)

    mixinPropKeys.forEach((prop) => {
      set(
        propsData,
        prop,
        // 优先使用 props 中的数据，适配子组件重定义 props 的场景
        vm.proxy.$props[prop]
        // props 中找不到，说明 props 是在 mixin 中定义的，则使用 attrs 中的数据
        ?? attrs[prop]
        // attrs 中找不到，则使用默认值
        ?? defaultCache[prop],
      )
    })
  })

  return propsData
}

function getDefault({ type, default: defaultValue }: any = {}) {
  const val = (
    [Array, Object].includes(type)
    && typeof defaultValue === 'function'
  )
    ? defaultValue()
    : defaultValue

  return val
}

function formatAttrs(attrs: AnyObject) {
  const data: AnyObject = {}
  Object.keys(attrs)
    .forEach((attr) => {
      const attrName = formatAttrName(attr)
      data[attrName] = attrs[attr]
    })

  return data
}

function formatAttrName(name: string) {
  const [first, ...rest] = name.split('-')

  return [first]
    .concat(rest.map(word => word[0].toUpperCase() + word.slice(1)))
    .join('')
}
