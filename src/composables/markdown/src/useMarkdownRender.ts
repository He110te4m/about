import type { MaybeComputedRef } from '@vueuse/core'
import DOMPurify from 'dompurify'
import { marked } from './marked'

export function useMarkdownRender(mdText: MaybeComputedRef<string>) {
  return computed(() => DOMPurify.sanitize(marked.parse(resolveUnref(mdText))))
}
