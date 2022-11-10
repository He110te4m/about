import type { MaybeComputedRef, MaybeRef } from '@vueuse/core'
import { marked } from './marked'
import { useMarkdownRender } from './useMarkdownRender'

export interface ExtractMarkdownSummaryOptions {
  paragraphNum?: number
  includeTitle?: boolean
}

export function useMarkdownSummary(mdText: MaybeComputedRef<string>, markdownSummaryOptions: MaybeRef<ExtractMarkdownSummaryOptions> = {}) {
  return computed(() => {
    const options = unref(markdownSummaryOptions)
    const { paragraphNum = 1 } = options
    if (paragraphNum < 1) {
      return ''
    }

    const md = resolveUnref(mdText)
    const tokens = marked.lexer(md)
    const summaryTokens = getSummaryTokens(tokens, options)

    return summaryTokens
      .map(paragraph => useMarkdownRender(paragraph.raw).value)
      .join('')
  })
}

function getSummaryTokens(tokens: marked.Token[], { paragraphNum = 1, includeTitle = false }: ExtractMarkdownSummaryOptions = {}) {
  const summaryTokens: (marked.Tokens.Heading | marked.Tokens.Paragraph)[] = []

  let paragraphCount = 0
  const sum = Math.floor(paragraphNum)

  tokens.forEach((token) => {
    if (paragraphCount >= sum) {
      return
    }

    if (token.type === 'paragraph') {
      paragraphCount++
    }
    if (token.type === 'paragraph' || (includeTitle && token.type === 'heading')) {
      summaryTokens.push(token)
    }
  })

  return summaryTokens
}
