import { useBreakpoints } from '@vueuse/core'
import { constant } from 'fp-ts/lib/function'
import { computed, unref } from 'vue'
import { guard } from '~/utils/filters/guard'

const breakPointSize = ['lg', 'md', 'sm', 'xs'] as const
type BreakPointSize = (typeof breakPointSize)[number]

const breakPoints: Record<BreakPointSize, number> = {
  xs: 600,
  sm: 1024,
  md: 1440,
  lg: 1920,
}

export function useAnimaterCount() {
  const { greaterOrEqual, smaller } = useBreakpoints(breakPoints)

  const xl = greaterOrEqual('lg')
  const lg = greaterOrEqual('md')
  const md = greaterOrEqual('sm')
  const sm = greaterOrEqual('xs')
  const xs = smaller('xs')

  const count = computed(() =>
    guard<null, number | undefined>([
      [constant(unref(xl)), constant(1200)],
      [constant(unref(lg)), constant(1000)],
      [constant(unref(md)), constant(700)],
      [constant(unref(sm)), constant(500)],
      [constant(unref(xs)), constant(300)],
    ])(constant(undefined))(null),
  )

  return { count }
}

export function getAnimaterCount(breakPoints: Record<BreakPointSize, boolean>) {
  const { xs, sm, md, lg } = breakPoints

  return guard<null, number | undefined>([
    [constant(xs), constant(300)],
    [constant(sm), constant(700)],
    [constant(md), constant(1000)],
    [constant(lg), constant(1200)],
  ])(constant(undefined))(null)
}
