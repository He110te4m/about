import { useBreakpoints as _useBreakpoints } from '@vueuse/core'
import { breakPoints } from '~/configs'

export function useBreakpoints() {
  const { greaterOrEqual, smaller } = _useBreakpoints(breakPoints)

  const xl = greaterOrEqual('lg')
  const lg = greaterOrEqual('md')
  const md = greaterOrEqual('sm')
  const sm = greaterOrEqual('xs')
  const xs = smaller('xs')

  return {
    xl,
    lg,
    md,
    sm,
    xs,
  }
}
