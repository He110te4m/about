import { describe, expect, it } from 'vitest'
import { useMarkdownRender } from '../..'
import { headerPrefix } from '../const'

describe('Render markdown to HTML', () => {
  it('render Header', () => {
    const mdText = `
# title1
## title2
### title3
#### title4
##### title5
###### title6
`

    const parsedHTML = useMarkdownRender(mdText)

    expect(parsedHTML.value).toBe(`<h1 id="${headerPrefix}title1">title1</h1>
<h2 id="${headerPrefix}title2">title2</h2>
<h3 id="${headerPrefix}title3">title3</h3>
<h4 id="${headerPrefix}title4">title4</h4>
<h5 id="${headerPrefix}title5">title5</h5>
<h6 id="${headerPrefix}title6">title6</h6>
`)
  })
})
