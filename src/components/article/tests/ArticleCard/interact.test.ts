import { describe, expect, it } from 'vitest'
import { type Article } from '../..'
import { createArticle, getArticleCardWrapper } from '../utils'

describe('ArticleCard interact', () => {
  it('click title', async () => {
    const id = 'test `ArticleCard` click-title event'
    await testClickEvent({
      article: { id },
      cls: '.components-article-card__header__title',
      toBeValue: id,
      eventName: 'click-title',
    })
  })

  it('click category', async () => {
    const category = 'test `ArticleCard` click-category event'
    await testClickEvent({
      article: { category },
      cls: '.components-article-card__footer__category',
      toBeValue: category,
      eventName: 'click-category',
    })
  })

  it('click tag', async () => {
    const tag = 'test `ArticleCard` click-tag event'
    await testClickEvent({
      article: { tags: [tag] },
      cls: '.components-article-card__footer__tags__item',
      toBeValue: tag,
      eventName: 'click-tag',
    })
  })
})

interface TestClickEventOptions {
  eventName: string
  article: Partial<Article>
  cls: string
  toBeValue: any
}
async function testClickEvent({ eventName, article, cls, toBeValue }: TestClickEventOptions) {
  const wrapper = getArticleCardWrapper(createArticle(article))

  const el = wrapper.find(cls)
  expect(el.exists()).toBeTruthy()

  await el.trigger('click')
  const titleClickEmitted = wrapper.emitted()[eventName]?.[0] as [unknown] | undefined
  expect(titleClickEmitted).toHaveLength(1)
  expect(titleClickEmitted?.[0]).toBe(toBeValue)
}
