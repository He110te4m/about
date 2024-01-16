import { isRef, unref } from 'vue-demi'
import type { AnyObject, Mixin } from '../types'

export function createProxy(data: Mixin, getObj: () => AnyObject) {
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
