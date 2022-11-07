import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { type Article, ArticleCard, ArticleList } from '..'

describe('ArticleList render', () => {
  it('render', () => {
    // TODO test `ArticleList` render
    const wrapper = mount(ArticleList, { props: { list: [] } })
    expect(wrapper).matchSnapshot()
  })
})

describe('ArticleCard render', () => {
  it('render title', () => {
    const article: Article = {
      title: 'test render',
      id: 'test-render',
      category: 'test',
      createdAt: Date.now(),
      content: 'test content',
    }

    const wrapper = mount(ArticleCard, {
      props: {
        article,
      },
    })

    const titleEl = wrapper.find('.components-article-card__header__title')

    expect(titleEl).toBeTruthy()
    expect(titleEl.text()).toBe(article.title)
  })
})
