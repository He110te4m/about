import { describe, expect, it } from 'vitest'
import { type Article } from '../..'
import { createArticle, formatDate, getArticleCardWrapper } from '../utils'

describe('ArticleCard responsive', () => {
  it('title\'s responsive', async () => {
    const title = '`ArticleCard` Title'
    const oldArticle = createArticle()
    await testArticleCardResponsive({
      oldArticle,
      oldText: oldArticle.title,
      article: { title },
      newText: title,
      cls: '.components-article-card__header__title',
    })
  })

  it('content \'s responsive', async () => {
    const content = '`ArticleCard` content'
    const oldArticle = createArticle()
    await testArticleCardResponsive({
      oldArticle,
      oldText: oldArticle.content,
      article: { content },
      newText: content,
      cls: '.components-article-card__content',
    })
  })

  it('category \'s responsive', async () => {
    const category = '`ArticleCard` category'
    const oldArticle = createArticle()

    await testArticleCardResponsive({
      oldArticle,
      oldText: oldArticle.category,
      article: { category },
      newText: category,
      cls: '.components-article-card__footer__category',
    })
  })

  it('tags \'s responsive', async () => {
    const tags = ['`ArticleCard` tags 1', '`ArticleCard` tags 2']
    const oldArticle = createArticle()

    await testArticleCardResponsive({
      oldArticle,
      oldText: oldArticle.tags?.join('') ?? '',
      article: { tags },
      newText: tags.join(''),
      cls: '.components-article-card__footer__tags',
    })
  })

  it('createdAt \'s responsive', async () => {
    const createdAt = Date.now()
    const formattedText = formatDate(createdAt)
    const oldArticle = createArticle()

    await testArticleCardResponsive({
      oldArticle,
      oldText: formatDate(oldArticle.createdAt),
      article: { createdAt },
      newText: formattedText,
      cls: '.components-article-card__footer__created-time',
    })
  })

  it('updatedAt \'s responsive', async () => {
    const updatedAt = Date.now()
    const formattedText = formatDate(updatedAt)
    const oldArticle = createArticle()
    await testArticleCardResponsive({
      oldArticle,
      oldText: oldArticle.updatedAt ? formatDate(oldArticle.updatedAt) : '',
      article: { updatedAt },
      newText: formattedText,
      cls: '.components-article-card__footer__updated-time',
    })
  })
})

interface TestArticleCardResponsiveOptions {
  oldArticle: Article
  oldText: string
  article: Partial<Article>
  newText: string
  cls: string
}

async function testArticleCardResponsive({ oldArticle, oldText, article, newText, cls }: TestArticleCardResponsiveOptions) {
  const wrapper = getArticleCardWrapper(oldArticle)

  const el = wrapper.find(cls)

  expect(el).toBeTruthy()
  expect(el.text()).toBe(oldText)

  await wrapper.setProps({
    article,
  })
  expect(el.text()).toBe(newText)
}
