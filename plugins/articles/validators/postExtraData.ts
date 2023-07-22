import { z } from 'zod'

export const postExtraDataValidator = z.object(
  {
    title: z.string(),
    description: z.string().default(''),
    createdAt: z.string(),
    updatedAt: z.string(),
    category: z.string().default('other'),
    tags: z.array(z.string()).default([]),
    series: z.object({
      title: z.string(),
      order: z.number(),
    }),
  },
).partial({
  series: true,
  updatedAt: true,
})

export type PostExtraData = z.infer<typeof postExtraDataValidator>
