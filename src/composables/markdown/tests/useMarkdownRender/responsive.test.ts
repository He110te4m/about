import { describe, expect, it } from 'vitest'
import { useMarkdownRender } from '../..'
import { headerPrefix } from '../const'

describe('test Responsive', () => {
  it('no responsive', () => {
    let mdText = '# title1'
    const parsedHTML = useMarkdownRender(mdText)
    expect(parsedHTML.value).toBe(`<h1 id="${headerPrefix}title1">title1</h1>
`)

    mdText = '## title2'
    expect(parsedHTML.value).toBe(`<h1 id="${headerPrefix}title1">title1</h1>
`)
  })

  it('ref responsive', () => {
    const mdText = ref('# title1')
    const parsedHTML = useMarkdownRender(mdText)
    expect(parsedHTML.value).toBe(`<h1 id="${headerPrefix}title1">title1</h1>
`)

    mdText.value = '## title2'
    expect(parsedHTML.value).toBe(`<h2 id="${headerPrefix}title2">title2</h2>
`)
  })

  it('getter responsive', () => {
    const article = reactive({ content: '# title1' })
    const parsedHTML = useMarkdownRender(() => article.content)
    expect(parsedHTML.value).toBe(`<h1 id="${headerPrefix}title1">title1</h1>
`)

    article.content = '## title2'
    expect(parsedHTML.value).toBe(`<h2 id="${headerPrefix}title2">title2</h2>
`)
  })
})
