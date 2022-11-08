import { describe, expect, it } from 'vitest'
import { getArticleListWrapper } from '../utils'

describe('ArticleList render', () => {
  it('render', () => {
    // TODO test `ArticleList` render
    const wrapper = getArticleListWrapper()
    expect(wrapper.exists()).toBeTruthy()
  })
})
