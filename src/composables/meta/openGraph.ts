import { type Meta } from '@unhead/vue'

export function getOpenGraphMeta({ title, description }: Record<'title' | 'description', string>): Meta[] {
  const route = useRoute()

  return [
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: () => new URL(route.fullPath, import.meta.url).href,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
  ]
}
