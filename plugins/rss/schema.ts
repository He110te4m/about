import { z } from 'zod'
import { postExtraDataValidator } from '../../utils/post'

const RSSItemCommonSchema = z.object({
  pubDate: z
    .union([z.string(), z.number(), z.date()])
    .optional()
    .transform(value => (value === undefined ? value : new Date(value)))
    .refine(value => (value === undefined ? value : !Number.isNaN(value.getTime()))),
  customData: z.string().optional(),
  categories: z.array(z.string()).optional(),
  author: z.string().optional(),
  commentsUrl: z.string().optional(),
  source: z.object({ url: z.string().url(), title: z.string() }).optional(),
  enclosure: z
    .object({
      url: z.string(),
      length: z.number().positive().int().finite(),
      type: z.string(),
    })
    .optional(),
  link: z.string().optional(),
  content: z.string().optional(),
})

export const RSSItemSchema = z.union([
  z
    .object({
      title: z.string(),
      description: z.string().optional(),
    })
    .merge(RSSItemCommonSchema),
  z
    .object({
      title: z.string().optional(),
      description: z.string(),
    })
    .merge(RSSItemCommonSchema),
])

export const RSSOptionValidator = z.object({
  title: z.string(),
  description: z.string(),
  site: z.preprocess(url => (url instanceof URL ? url.href : url), z.string().url()),
  items: z.array(RSSItemSchema).optional(),
  xmlns: z.record(z.string()).optional(),
  stylesheet: z.union([z.string(), z.boolean()]).optional(),
  customData: z.string().optional(),
  trailingSlash: z.boolean().optional().default(true),
})

export const RSSGeneratorOptionValidator = z.object({
  fileName: z.string().optional(),
  rss: RSSOptionValidator,
  posts: z.array(
    postExtraDataValidator
      .merge(
        z.object({
          url: z.string(),
        }),
      ),
  ),
})
