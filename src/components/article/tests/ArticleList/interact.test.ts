import { describe, expect, it, vitest } from 'vitest'
import type { Article } from '../..'
import { createArticle, getArticleListWrapper } from '../utils'

const article1 = createArticle({
  id: 'article-1',
  title: 'test article 1',
  category: 'test article category-1',
  tags: ['article-1 tag-1', 'article-1 tag-2'],
})
const article2 = createArticle({
  id: 'article-2',
  title: 'test article 2',
  category: 'test article category-2',
  tags: ['article-2 tag-1', 'article-2 tag-2'],
})

const list = [article1, article2]

describe('ArticleList interact cases', () => {
  it('click-title event', async () => {
    await testClickEvent({
      event: 'onClickTitle',
      cls: '.components-article-card__header__title',
      checkCalledParams: ({ id }) => [id],
    })
  })

  it('click-category event', async () => {
    await testClickEvent({
      event: 'onClickCategory',
      cls: '.components-article-card__footer__category',
      checkCalledParams: ({ category }) => [category],
    })
  })

  it('click-tag event', async () => {
    const tagCount = list.reduce((sum, article) => sum + (article.tags?.length ?? 0), 0)
    const wrapper = getArticleListWrapper(list)
    const domList = wrapper.findAll('.components-article-card__footer__tags__item')
    expect(domList).toHaveLength(tagCount)

    const eventHandle = vitest.fn()
    await wrapper.setProps({
      onClickTag: eventHandle,
    })
    await Promise.all(domList.map(dom => dom.trigger('click')))

    expect(eventHandle).toBeCalledTimes(tagCount)
    list.forEach((article) => {
      article.tags?.forEach((tag) => {
        expect(eventHandle).toHaveBeenCalledWith(tag)
      })
    })
  })
})

interface Options {
  cls: string
  event: string
  checkCalledParams: (article: Article) => unknown[]
}

async function testClickEvent({ cls, event, checkCalledParams }: Options) {
  const wrapper = getArticleListWrapper(list)
  const domList = wrapper.findAll(cls)
  expect(domList).toHaveLength(list.length)

  const eventHandle = vitest.fn()
  await wrapper.setProps({
    [event]: eventHandle,
  })
  await Promise.all(domList.map(dom => dom.trigger('click')))

  expect(eventHandle).toBeCalledTimes(list.length)
  list.forEach((item) => {
    expect(eventHandle).toHaveBeenCalledWith(...checkCalledParams(item))
  })
}
