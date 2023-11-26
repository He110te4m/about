import type { PostPagerOption } from './types'
import type { PostInfo } from '~posts'

export function makePostsPager(_options: PostPagerOption = {}) {
  return (posts: PostInfo[]) => posts
}
