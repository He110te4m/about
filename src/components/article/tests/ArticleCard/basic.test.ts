import { describe, expect, it } from 'vitest'
import { type Article } from '../..'
import { createArticle, getArticleCardWrapper } from '../utils'

describe('ArticleCard render', () => {
  it('render title', () => {
    const title = '`ArticleCard` Title'
    testArticleCardRender({ title }, title, '.components-article-card__header__title')
  })
})

function testArticleCardRender(article: Partial<Article>, toBeText: string, cls: string) {
  const wrapper = getArticleCardWrapper(createArticle(article))

  const el = wrapper.find(cls)

  expect(el).toBeTruthy()
  expect(el.text()).toBe(toBeText)
}
