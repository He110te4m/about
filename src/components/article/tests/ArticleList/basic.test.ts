import { describe, expect, it } from 'vitest'
import { createArticle, getArticleListWrapper } from '../utils'

describe('ArticleList basic cases', () => {
  it('render', () => {
    const len = 10
    const wrapper = getRenderedArticleList(len)
    testArticleListRender(wrapper, len)
  })

  it('responsive', async () => {
    const oldLen = 6
    const wrapper = getRenderedArticleList(oldLen)
    testArticleListRender(wrapper, oldLen)

    const len = 10
    const list = new Array(len).fill(null).map(() => createArticle())
    await wrapper.setProps({
      list,
    })
    testArticleListRender(wrapper, len)
  })
})

function getRenderedArticleList(len: number) {
  const list = new Array(len).fill(null).map(() => createArticle())

  return getArticleListWrapper(list)
}

function testArticleListRender(wrapper: ReturnType<typeof getArticleListWrapper>, len: number) {
  const articleDOMList = wrapper.findAll('.components-article-list__article')
  expect(articleDOMList).toHaveLength(len)
}
