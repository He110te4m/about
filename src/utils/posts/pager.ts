import type { PostPagerOption } from './types'
import type { PostInfo } from '~posts'

export function makePostsPager({ page = 1, size = 10 }: PostPagerOption = {}) {
  const startIndex = (page - 1) * size
  const endIndex = startIndex + size

  return (posts: PostInfo[]) => posts.slice(startIndex, endIndex)
}
