import type { UseFetchReturn } from '@vueuse/core'
import type { ComputedRef } from 'vue'
import type { Article } from './types'

const articleListKey = Symbol('article-list')

interface CacheStorage {
  [articleListKey]: UseFetchReturn<Article[]>
}

const cacheOperator = new CacheOperator<CacheStorage>()

export function getArticleList() {
  if (!cacheOperator.has(articleListKey)) {
    cacheOperator.set(articleListKey, useFetch('blog/articles/list').json<Article[]>())
  }

  return cacheOperator.get(articleListKey)!
}

export function getArticle(id: Article['id']): { data: ComputedRef<Nullable<Article>> } {
  const { data: list } = getArticleList()
  const article = computed(() => list.value?.find(article => article.id === id))

  const { data: content } = useFetch<string>(`blog/articles/list/${id}.md`)

  const data = computed(() => {
    if (!article.value || !content.value) {
      return null
    }

    return { ...article.value, content: content.value }
  })

  return { data }
}
