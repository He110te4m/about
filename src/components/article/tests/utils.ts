import { mount } from '@vue/test-utils'
import { type Article, ArticleCard, ArticleList } from '..'

export function getArticleCardWrapper(article: Article = createArticle()) {
  return mount(ArticleCard, {
    props: {
      article,
    },
  })
}

export function getArticleListWrapper(list: Article[] = [createArticle()]) {
  return mount(ArticleList, {
    props: {
      list,
    },
  })
}

export function createArticle(overrideArticle: Partial<Article> = {}): Article {
  const createdDate = new Date()
  createdDate.setDate(-10)
  const updatedDate = new Date()
  updatedDate.setDate(-1)

  return {
    title: 'test render',
    id: 'test-render',
    category: 'test',
    createdAt: createdDate.getTime(),
    updatedAt: updatedDate.getTime(),
    tags: ['tag1', 'tag2'],
    content: 'test content',

    ...overrideArticle,
  }
}

export function formatDate(timestamp: number) {
  const date = new Date(timestamp)

  const year = padNum(date.getFullYear())
  const month = padNum(date.getMonth() + 1)
  const day = padNum(date.getDate())

  return `${year}-${month}-${day}`
}

function padNum(number: number) {
  return String(number).padStart(2, '0')
}
