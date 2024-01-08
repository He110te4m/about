import type { z } from 'zod'
import type { postExtraDataValidator } from './schema'

export type ResolveToRoutePath = (file: string) => string

export interface GetAllPostsOption {
  postDir: string
  resolveToRoutePath?: ResolveToRoutePath
}

export type PostExtraData = z.infer<typeof postExtraDataValidator>

export interface PostInfo extends PostExtraData {
  url: string
}
