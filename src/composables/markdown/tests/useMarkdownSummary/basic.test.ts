import { describe, expect, it } from 'vitest'
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
  it('Extract with default options', () => {
    const summary = useMarkdownSummary(mdText)

    expect(summary.value).toBe(singleSummary)
  })

  it('Extract with title', () => {
    const summary = useMarkdownSummary(mdText, { includeTitle: true })

    expect(summary.value).toBe(summaryWithTitle)
  })

  it('Extract with multiple paragraph', () => {
    const summary = useMarkdownSummary(mdText, { paragraphNum: 2 })

    expect(summary.value).toBe(doubleSummary)
  })

  it('Extract with title and multiple paragraph', () => {
    const summary = useMarkdownSummary(mdText, { includeTitle: true, paragraphNum: 2 })

    expect(summary.value).toBe(doubleSummaryWithTitle)
  })
})

describe('Extract summary with invalid options', () => {
  it('Extract with `-Infinity` paragraph', () => {
    testWithInvalidParagraphNum(-Infinity)
  })

  it('Extract with `0` paragraph', () => {
    testWithInvalidParagraphNum(0)
  })

  it('Extract with `-1` paragraph', () => {
    testWithInvalidParagraphNum(-1)
  })

  it('Extract with `-3.14` paragraph', () => {
    testWithInvalidParagraphNum(-3.14)
  })

  it('Extract with `2.2` paragraph', () => {
    const summary = useMarkdownSummary(mdText, { paragraphNum: 2.2 })

    expect(summary.value).toBe(doubleSummary)
  })

  it('Extract with `1.9` paragraph', () => {
    const summary = useMarkdownSummary(mdText, { paragraphNum: 1.9 })

    expect(summary.value).toBe(singleSummary)
  })

  it('Extract with `Infinity` paragraph', () => {
    const summary = useMarkdownSummary(mdText, { paragraphNum: Infinity })

    expect(summary.value).toBe(doubleSummary)
  })
})

function testWithInvalidParagraphNum(invalidNum: number) {
  const summary = useMarkdownSummary(mdText, { paragraphNum: invalidNum })

  expect(summary.value).toBe('')
}
