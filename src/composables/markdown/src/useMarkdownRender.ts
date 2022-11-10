import type { MaybeComputedRef } from '@vueuse/core'
import DOMPurify from 'dompurify'
import { marked } from './marked'

export function useMarkdownRender(mdText: MaybeComputedRef<string>) {
  return computed(() => renderMarkdown(resolveUnref(mdText)))
}

function renderMarkdown(mdText: string) {
  return DOMPurify.sanitize(marked.parse(mdText))
}
