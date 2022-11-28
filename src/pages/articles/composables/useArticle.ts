import type { ComputedRef } from 'vue'
import type { Article } from '~/apis/article'

export function useArticle(id: ComputedRef<string>) {
  const article = ref<Nullable<Article>>(null)

  watch(
    id,
    (id) => {
      const { data } = getArticle(id)
      const stop = whenever(data, (data) => {
        article.value = data
        stop()
      })
    },
    { immediate: true },
  )

  return { article }
}
