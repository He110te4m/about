declare module '~posts' {
  import type { PostInfo as Info } from './post'

  export type PostInfo = Info
  export const posts: PostInfo[]
}
