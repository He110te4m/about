import type { z } from 'zod'
import type { postExtraDataValidator, postOptionValidator } from './schema'

export type ResolveToRoutePath = (file: string) => string

export type GetAllPostsOption = z.infer<typeof postOptionValidator>

export type PostExtraData = z.infer<typeof postExtraDataValidator>

export interface PostInfo extends PostExtraData {
  url: string
}
