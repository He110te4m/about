declare module '~posts' {
  /// <reference path="../../utils/post/index.ts" />
  import type { PostInfo as Info } from 'post-type'

  export type PostInfo = Info
  export const posts: Info[]
}
