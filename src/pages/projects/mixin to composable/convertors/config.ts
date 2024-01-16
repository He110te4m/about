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
