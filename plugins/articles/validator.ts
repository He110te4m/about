import { z } from 'zod'

export const postExtraDataValidator = z.object(
  {
    title: z.string(),
    description: z.string().default(''),
    pubDate: z.number().default(0),
    category: z.string().default(''),
    tags: z.array(z.string()).default([]),
  },
)

export type PostExtraData = z.infer<typeof postExtraDataValidator>
