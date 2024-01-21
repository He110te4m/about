import { constant } from 'fp-ts/lib/function'
import { computed, unref } from 'vue'
import { useBreakpoints } from '~/composables/breakpoints'
import { guard } from '~/utils/filters/guard'

export function useStarCount() {
  const {
    xl,
    lg,
    md,
    sm,
    xs,
  } = useBreakpoints()

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
