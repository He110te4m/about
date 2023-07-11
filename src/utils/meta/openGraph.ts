import { type Meta } from '@unhead/vue'

export function getOpenGraphMeta({ title, description }: Record<'title' | 'description', string>): Meta[] {
  return [
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: import.meta.url,
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
