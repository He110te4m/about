import { describe, expect, it } from 'vitest'
import type { ExtractMarkdownSummaryOptions } from '../..'
import { useMarkdownSummary } from '../..'
import { headerPrefix } from '../const'

const mdText = `
# title1

> reference to Marked

This is the **context**, and some *info*

## title2

This is a [link](https://me.he110.site)
`

const summaryWithTitle = `<h1 id="${headerPrefix}title1">title1</h1>
<p>This is the <strong>context</strong>, and some <em>info</em></p>
`
const singleSummary = `<p>This is the <strong>context</strong>, and some <em>info</em></p>
`
const doubleSummary = `<p>This is the <strong>context</strong>, and some <em>info</em></p>
<p>This is a <a href="https://me.he110.site">link</a></p>
`
const doubleSummaryWithTitle = `<h1 id="${headerPrefix}title1">title1</h1>
<p>This is the <strong>context</strong>, and some <em>info</em></p>
<h2 id="${headerPrefix}title2">title2</h2>
<p>This is a <a href="https://me.he110.site">link</a></p>
`

describe('Extract summary automatically', () => {
  it('Extract with title', () => {
    const options = ref<ExtractMarkdownSummaryOptions>({})
    const summary = useMarkdownSummary(mdText, options)

    expect(summary.value).toBe(singleSummary)

    options.value.includeTitle = true
    expect(summary.value).toBe(summaryWithTitle)

    options.value.paragraphNum = 2
    expect(summary.value).toBe(doubleSummaryWithTitle)

    options.value.includeTitle = false
    expect(summary.value).toBe(doubleSummary)
  })
})
