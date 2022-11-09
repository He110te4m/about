import { describe, expect, it } from 'vitest'
import { type Article } from '../..'
import { createArticle, formatDate, getArticleCardWrapper } from '../utils'

describe('ArticleCard render', () => {
  it('render title', () => {
    const title = '`ArticleCard` Title'
    testArticleCardRender({ title }, title, '.components-article-card__header__title')
  })

  it('render content', () => {
    const content = '`ArticleCard` content'
    testArticleCardRender({ content }, content, '.components-article-card__content')
  })

  it('render category', () => {
    const category = '`ArticleCard` category'
    testArticleCardRender({ category }, category, '.components-article-card__footer__category')
  })

  it('render tags', () => {
    const tags = ['`ArticleCard` tags 1', '`ArticleCard` tags 2']
    testArticleCardRender({ tags }, tags.join(''), '.components-article-card__footer__tags')
  })

  it('render createdAt', () => {
    const createdAt = Date.now()
    const formattedText = formatDate(createdAt)
    testArticleCardRender({ createdAt }, formattedText, '.components-article-card__footer__created-time')
  })

  it('render updatedAt', () => {
    const updatedAt = Date.now()
    const formattedText = formatDate(updatedAt)
    testArticleCardRender({ updatedAt }, formattedText, '.components-article-card__footer__updated-time')
  })
})

function testArticleCardRender(article: Partial<Article>, toBeText: string, cls: string) {
  const wrapper = getArticleCardWrapper(createArticle(article))

  const el = wrapper.find(cls)

  expect(el).toBeTruthy()
  expect(el.text()).toBe(toBeText)
}
