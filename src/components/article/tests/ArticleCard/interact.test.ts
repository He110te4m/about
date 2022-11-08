import { describe, expect, it } from 'vitest'
import { type Article } from '../..'
import { createArticle, getArticleCardWrapper } from '../utils'

describe('ArticleCard interact', () => {
  it('click title', async () => {
    const id = 'test `ArticleCard`'
    const wrapper = getArticleCardWrapper(createArticle({ id }))

    const titleEl = wrapper.find('.components-article-card__header__title')
    expect(titleEl.exists()).toBeTruthy()

    await titleEl.trigger('click')
    const titleClickEmitted = wrapper.emitted()['click-title']?.[0] as [Article['id']] | undefined
    expect(titleClickEmitted).toHaveLength(1)
    expect(titleClickEmitted?.[0]).toBe(id)
  })
})
