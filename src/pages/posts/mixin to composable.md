---
title: vue2 在 composable 中使用 mixin
category: Front End
description: "考虑历史债务问题， vue2 代码中 composable 与 mixin 共存是一个长期情况，而 mixin 又会限制组件无法使用 composable ，本文旨在研究如何解除 mixin 对 composable 的限制问题"
createdAt: 2024/01/15 11:36:04
updatedAt: 2024/01/15 17:16:04
---

本文分为以下部分：

[[toc]]

# 背景

vue2 历史代码中存在大量 `mixin` ，并且存在多种写法：

- `const mixin = {}`
- `const mixin = Vue.extends({})`
- `@Component class Mixin extends Vue {}`

在新版 API 中，拥有的更细粒度的复用能力的 [`Composition API`](https://vuejs.org/api/composition-api-setup.html#composition-api-setup) 异军突起，将 `mixin` 扫入历史垃圾堆。

然而，为了使用 `Composition API` ，项目不得不放弃 `mixin` ，因为两者并没有兼容 API 进行转换，故而需要复用老代码功能时，要么采用原有的 `Options API` 或者 `vue-class` 写法，要么重新封装 `mixin` ，将功能转为 `composable` 。

## 重构 mixin

重构自然是更加适配技术发展的方式，但是也会面临较多问题：

- 是否有足够的开发时间重构 `mixin` ，尤其是 `mixin` 嵌套或者多 `mixin` 共存的情况下。
- 重构后，原有的 `mixin` 要如何处理，如果废弃，需要将原有的使用该 `mixin` 的所有组件，全部重构，修改为 `Composition API` 的组件；如果不废弃，后续维护时涉及到 `mixin` 的变更同步，会是另一个新的包袱。

## 保留 `Options API`

保留 `Options API` 则没有上述的问题，但是这也会阻碍 `Composition API` 的落地。

在老模块中想要落地 `Composition API` 会面向较多问题，最为痛苦的场景是先使用 `Composition API` 实现，由于需求变更需要复用某个特定的能力，也就是使用 `mixin` 。

## 解决思路

问题的根源在于， `Composition API` 并没有给 `mixin` 留下位置，导致在 `composable` 中，复用 `mixin` 的生命周期等功能还可以解决，但是如果需要与 `mixin` 交互，则会面临获取不到或是类型报错的情况。

> `Composition API` 参考了 `vue3` 的安全限制， [将 `template` 中没有使用的 `data` 等内容也一并隐藏起来](https://github.com/vuejs/composition-api/blob/2436ba2ca0ae804a3932924407f54e675073ea5c/src/mixin.ts#L55) 了，不能通过 [`getCurrentInstance`](https://vuejs.org/api/reactivity-advanced.html#getcurrentscope) 直接获取。

既然如此，那只要能通过某种方式，将 `mixin` 的选项通过 `composable` 转换为对应的 `Composition API` ，就能够在不影响老代码的情况下继续使用 `mixin` 了。

# `useMixin()` 构想

想要将 `mixin` 的选项解析为 `composable` ，可以从以下几个角度入手：

- 不同写法的 `mixin` 如何兼容，如 `Options API` 、 `vue-class` 。
- 如何处理 `mixin` 嵌套的问题。
- 与 `mixin` 作用相似的 `extends` 是否也可以支持，否则 `mixin` 嵌套 `extends` 的场景就不能支持了。
- 不同的配置需要的解析方式不一样，部分 API 可以直接通过已有的 `composable` 解决，如生命周期，需要区分不同的配置单独处理。
- `mixin` 的内容合入与子组件的配置合并，如生命周期、 data 等。
- 组件中的 `this` 指向问题，需要重新构建一个新的对象来保存 `mixin` 内容。

## 统一入参

Vue2 中的组件存在多种形式：

1. `const mixin = {}`
2. `const mixin = Vue.extends({})`
3. `@Component class Mixin extends Vue {}`

其中 2、3 的写法是可以当做一种的，底层都是使用了 `Vue.extends` ，而 1 就是 `Vue.extends` 的参数，需要额外调用一次 `Vue.extends` 就能将多种写法统一为一种，如下：

```typescript
const component = (mixin && 'prototype' in mixin && mixin.prototype instanceof Vue)
  ? mixin
  : Vue.extend(mixin)
```

通过 `Vue.extends` 还能实现 `options` 的合并，如 `mixin` 中含有 `mixin` 或者 `extends` 的场景，都可以支持合并，组件的 `$options` 即为合并后的 `options` ，只需要针对其处理即可。

## 拆分内容处理

### 处理 `this` 指向

在 `Options API` 中，访问 `this` 是一件很常见的操作，而实际上 `mixin` 中基本离不开 `this` ，所以针对 `this` 的修正是必须要进行的，否则 `mixin` 会有大量的功能缺失。

在考虑修正指向时，先考虑 `this` 上有什么内容：

- `$createElement` 、 `$router` 等内置或者后期挂载的全局变量
- `props`、`data`、`inject`、`computed`、`watch`、`methods` 等 `options` 配置

那么需要构造一个新的对象，将上述内容整合到此对象中，对象内需要包含的内容都可以在 [统一入参](#统一入参) 章节中生成的组件上获取到。

由于实际业务并没有对 IE11 的硬性兼容要求，也为了简化复杂度与方便权限控制（如禁止修改 `computed` 、 `props` 等内容），可以采用 `proxy` 进行处理

```typescript
import { isRef, unref } from 'vue-demi'
import type { AnyObject, Mixin } from '../types'

/** 创建 proxy */
function createProxy(data: Mixin, getObj: () => AnyObject) {
  const proxy = new Proxy(data, {
    get: makeGetComponentDataValue(getObj),
    set: setComponentDataValue,
  })

  return proxy
}

function makeGetComponentDataValue(getObj: () => AnyObject) {
  return (target: Mixin, key: string | symbol) => {
    if (typeof key === 'string' && key.startsWith('$')) {
      const obj = getObj()
      return obj[key]
    }

    const inject = target.inject ?? {}
    if (key in inject) {
      return unref(inject[key])
    }

    const propsData = target.propsData ?? {}
    if (key in propsData) {
      return unref(propsData[key])
    }

    const data = target.data ?? {}
    if (key in data) {
      return unref(data[key])
    }

    const computed = target.computed ?? {}
    if (key in computed) {
      return unref(computed[key])
    }

    const methods = target.methods ?? {}
    if (key in methods) {
      return unref(methods[key])
    }

    return undefined
  }
}

function setComponentDataValue(target: Mixin, key: string | symbol, value: any) {
  const data = target.data
  if (key in data) {
    if (isRef(data[key])) {
      data[key].value = value
    } else {
      data[key] = value
    }
  }

  return true
}
```

使用时的代码如下：

```typescript
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
```

### 处理 `props`

由于 `vue2` 内部已经写死了，[在组件初始化时确定 `props` ，并且此后不会再调用此函数更新 `props`](https://github.com/vuejs/vue/blob/main/src/core/instance/state.ts#L54) ，所以无法动态增删 `props` 。

这种情况下回归真实业务场景，使用 `mixin` 时，如果需要访问 `props` ， `props` 提供以下几个能力：

- 能够获取父组件传入的值，并且支持响应更新。
- 父组件未传值时，能够使用预先定义的默认值。
- 支持对值进行校验校验。

正如 [鸭子测试](https://zh.wikipedia.org/wiki/%E9%B8%AD%E5%AD%90%E6%B5%8B%E8%AF%95) 提到的那样，只要能提供上诉几个能力，不管这个数据是从哪里来的，也可以认为它是 `props` 。

根据 [`vue` 文档](https://vuejs.org/guide/components/attrs.html#fallthrough-attributes) ，我们可以发现， `props` 是会 fallthrough 成为 `attrs` 的，所以只需要将 `mixin` 中的 `props` 与 `attrs` 中对应的值关联即可。其中值得注意的是：

- 默认值可能是函数，如 `Array` 、 `Object` 等类型的默认值。
- `props` 可能被子组件中覆盖。
- `attrs` 中并没有对 `propName` 进行风格转换。

代码如下（由于业务场景中基本没有涉及到校验功能，故而并未实现具体的校验代码，可在取值后自行添加校验）：

```typescript
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
```

### 处理 `inject` / `provide`

`inject` 与 `provide` 的处理较为简单，解析配置对象后，像 `composable` 一样使用即可，如下：

```typescript
import { inject } from 'vue-demi'
import type { AnyObject, Mixin } from '../types'

export function convertInjectData(mixin: Mixin) {
  let injectData: AnyObject = {}

  if (mixin.inject) {
    if (Array.isArray(mixin.inject)) {
      injectData = getInjectDataFromArray(mixin.inject)
    } else {
      injectData = getInjectDataFromObject(mixin.inject)
    }
  }

  return injectData
}

function getInjectDataFromArray(injectOptions: string[]) {
  const injectData: AnyObject = {}

  injectOptions.forEach((name) => {
    injectData[name] = inject(name)
  })

  return injectData
}

function getInjectDataFromObject(injectOptions: AnyObject) {
  const injectData: AnyObject = {}
  Object.keys(injectOptions).forEach((key) => {
    const val = injectOptions[key]
    if (typeof val === 'object') {
      const injectKey = val.from ?? key
      injectData[key] = inject(injectKey, val.default)
    } else {
      injectData[key] = inject(val)
    }
  })

  return injectData
}
```

```typescript
import { provide } from 'vue-demi'
import type { AnyObject, Mixin } from '../types'

export function convertProvideData(mixin: Mixin, proxy: any) {
  if (mixin.provide) {
    const provideData: AnyObject = typeof mixin.provide === 'function'
      ? mixin.provide.bind(proxy)()
      : mixin.provide

    Reflect.ownKeys(provideData)
      .forEach((key) => {
        provide(key, provideData[key])
      })
  }
}
```

### 处理 `data`

`data` 的处理与 `inject` 相似，将 `options` 中的 `data` 配置解析即可。

```typescript
import { ref } from 'vue-demi'
import type { AnyObject, Mixin } from '../types'

export function convertData(mixin: Mixin) {
  const data: AnyObject = {}

  if (mixin.data) {
    const componentData = typeof mixin.data === 'function'
      ? mixin.data()
      : mixin.data

    for (const key of Object.keys(componentData)) {
      const initVal = componentData[key]
      data[key] = ref(initVal)
    }
  }

  return data
}
```

### 处理 `computed`

同上

```typescript
import { computed } from 'vue-demi'
import type { AnyObject, Mixin } from '../types'

export function convertComputed(mixin: Mixin, proxy: any) {
  const computedData: AnyObject = {}

  if (mixin.computed) {
    for (const name of Object.keys(mixin.computed)) {
      const fn = mixin.computed[name]
      if (typeof fn === 'function') {
        computedData[name] = computed(fn.bind(proxy))
      }
    }
  }

  return computedData
}
```

### 处理 `watch`

同上

```typescript
import { type WatchStopHandle, watch } from 'vue-demi'
import type { AnyObject, Mixin } from '../types'

export function convertWatch(mixin: Mixin, proxy: any) {
  const watchs: AnyObject = {}

  if (mixin.watch) {
    Object.keys(mixin.watch)
      .forEach((varName) => {
        const option = mixin.watch[varName]
        if (typeof option === 'function') {
          watchs[varName] = watch(() => proxy[varName], option)
          return
        }

        const { handler, ...rest } = option

        watchs[varName] = watch(() => proxy[varName], handler, rest)
      })
  }

  return watchs
}
```

### 处理 `methods`

`methods` 处理更加简单，通过 `bind` 修正 `this` 即可

```typescript
import type { AnyObject, Mixin } from '../types'

export function convertMethods(mixin: Mixin, proxy: any) {
  const methods: AnyObject = {}

  if (mixin.methods) {
    for (const name of Object.keys(mixin.methods)) {
      methods[name] = mixin.methods[name].bind(proxy)
    }
  }

  return methods
}
```

### 处理生命周期

生命周期中与 `methods` 相似，需要修正 `this` ，除此之外需要注意以下几点：

- 合并后生命周期函数可能是数组，也可能是函数，需要统一格式后处理。
- 考虑生命周期函数与 `options` 配置名不同的问题。
- 针对 `composable` 中取消的 `beforeCreate` 与 `created` ，可以直接进行调用。

```typescript
import {
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onErrorCaptured,
  onMounted,
  onServerPrefetch,
  onUnmounted,
  onUpdated,
} from 'vue-demi'
import type { Mixin } from '../types'
import { ensureArray } from '../utils'

const commonLifeCycles = {
  beforeMount: onBeforeMount,
  mounted: onMounted,
  beforeUpdate: onBeforeUpdate,
  updated: onUpdated,
  activated: onActivated,
  deactivated: onDeactivated,
  beforeDestroy: onBeforeUnmount,
  destroyed: onUnmounted,
  errorCaptured: onErrorCaptured,
  serverPrefetch: onServerPrefetch,
}
type LifeCycleName = keyof typeof commonLifeCycles

const lifeCycleNames = Object.keys(commonLifeCycles)

export function convertLifeCycle(mixin: Mixin, proxy: any) {
  Object.keys(mixin)
    .filter((key): key is LifeCycleName => lifeCycleNames.includes(key))
    .forEach((cycleName) => {
      ensureArray(mixin[cycleName])
        .filter((fn: (() => void) | undefined) => fn)
        .forEach((fn: () => void) => {
          commonLifeCycles[cycleName](
            fn.bind(proxy),
          )
        })
    })

  const cycles = [mixin.beforeCreate, mixin.created]
  cycles.forEach((cycle = []) => {
    ensureArray(cycle)
      .forEach((fn: () => void) => fn.call(proxy))
  })
}
```

### 处理其他配置

其余配置主要按照业务需求确定，如 `mixin` 场景基本不会继承 `render` ，所以我在实现时完全没有考虑 `render` 、 `el` 等配置的实现，抛砖引玉给出两个配置的实现方式，基本上均需要修改 `currentInstance` 来覆盖已有配置，代码如下：

```typescript
import { type ComponentInternalInstance, getCurrentInstance } from 'vue-demi'
import type { Mixin } from '../types'

export function convertComponentConfig(mixin: Mixin) {
  const vm = getCurrentInstance()
  if (!vm) {
    return
  }

  configComponentName(vm, mixin)
  configInheritAttrs(vm, mixin)
}

function configComponentName(vm: ComponentInternalInstance, mixin: Mixin) {
  if (mixin.name && !vm.type._componentTag) {
    vm.type._componentTag = mixin.name
  }
}

function configInheritAttrs(vm: ComponentInternalInstance, mixin: Mixin) {
  if ('inheritAttrs' in mixin) {
    const ctor: any = vm.proxy.$vnode.componentOptions?.Ctor
    if (!ctor?.options || typeof ctor.options.inheritAttrs !== 'undefined') {
      return
    }

    // @see https://github.com/vuejs/vue/blob/main/packages/server-renderer/src/modules/attrs.ts#L20
    ctor.options.inheritAttrs = mixin.inheritAttrs
  }
}
```

## 局限性

该方案仅适用于 `vue2` + `Composition API` ，其中使用的 `Proxy` 也可按需换成 `Map` 或普通对象。

本方案使用 `proxy` 的原因是：

- 无需考虑 IE11。
- 能提供更加简单的权限控制能力，而其他方案需要自行处理访问权限，如果遇到嵌套对象的场景，会更加痛苦。

`vue3` 理论上也可进行此类改造，但是既然用 `vue3` 了也不太会出现此类场景。

如果需要在 `vue3` 中使用此类场景，需要开启 [`VUE_PROD_DEVTOOLS`](https://vuejs.org/api/compile-time-flags#VUE_PROD_DEVTOOLS) 才能在生产环境获取到相关信息。

# 总结
