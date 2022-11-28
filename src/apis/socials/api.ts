import type { SocialItem } from './types'

export function getSocials() {
  return useFetch<SocialItem[]>('blog/socials/list').json()
}
