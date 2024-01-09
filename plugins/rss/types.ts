import type { z } from 'zod'
import type { RSSGeneratorOptionValidator, RSSItemSchema, RSSOptionValidator } from './schema'

export type RSSItem = z.infer<typeof RSSItemSchema>
export type RSSOption = z.infer<typeof RSSOptionValidator>
export type RSSGeneratorOption = z.infer<typeof RSSGeneratorOptionValidator>
