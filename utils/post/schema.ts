import { z } from 'zod'

export const postExtraDataValidator = z.object(
  {
    title: z.string(),
    description: z.string().default(''),
    createdAt: z.string(),
    updatedAt: z.string(),
    category: z.string().default('other'),
    tags: z.array(z.string()).default([]),
    series: z.string(),
  },
).partial({
  series: true,
  updatedAt: true,
})

export const postOptionValidator = z.object({
  postDir: z.string(),
  resolveToRoutePath: z.function()
    .args(z.string())
    .returns(z.string())
    .optional(),
})
