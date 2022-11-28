import type { Article } from './types'

export function getArticleList() {
  return useFetch<Article[]>('blog/articles/list').json()
}
