import { type Meta } from '@unhead/vue'

export function getTwitterMeta({ title, description }: Record<'title' | 'description', string>): Meta[] {
  return [
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      property: 'twitter:url',
      content: import.meta.url,
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
