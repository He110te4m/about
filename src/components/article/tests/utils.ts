import { mount } from '@vue/test-utils'
import { type Article, ArticleCard, ArticleList } from '..'

export function getArticleCardWrapper(article: Article = createArticle()) {
  return mount(ArticleCard, {
    props: {
      article,
    },
  })
}

export function getArticleListWrapper(articleList: Article[] = [createArticle()]) {
  return mount(ArticleList, {
    props: {
      list: articleList,
    },
  })
}

export function createArticle(overrideArticle: Partial<Article> = {}): Article {
  return {
    title: 'test render',
    id: 'test-render',
    category: 'test',
    createdAt: Date.now(),
    content: 'test content',

    ...overrideArticle,
  }
}
