const breakPointSize = ['lg', 'md', 'sm', 'xs'] as const
export type BreakPointSize = (typeof breakPointSize)[number]

export const breakPoints: Record<BreakPointSize, number> = {
  xs: 640,
  sm: 1024,
  md: 1440,
  lg: 1920,
}
