import { type Meta } from '@unhead/vue'
import { useRoute } from 'vue-router'

export function getTwitterMeta({ title, description }: Record<'title' | 'description', string>): Meta[] {
  const route = useRoute()

  return [
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      property: 'twitter:url',
      content: () => new URL(route.fullPath, import.meta.url).href,
    },
    {
      property: 'twitter:title',
      content: title,
    },
    {
      property: 'twitter:description',
      content: description,
    },
  ]
}
