import type { LinkItem } from './types'

export function getLinks() {
  return useFetch<LinkItem[]>('blog/links/list').json()
}
