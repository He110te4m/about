import type { Predicate } from 'fp-ts/lib/Predicate'
import { constTrue, flow } from 'fp-ts/lib/function'
import { filter, reduce } from 'fp-ts/lib/Array'
import MiniSearch from 'minisearch'
import { prop } from '../filters/record'
import { mustString } from '../formatters/string'
import type { PostFilterOption } from './types'
import type { PostInfo } from '~posts'

export function makePostsFilter({ subPath, category, keyword }: PostFilterOption = {}) {
  return pipeCondition([
    makeSubPathFilter(subPath),
    makeCategoryFilter(category),
    makeKeywordFilter(keyword),
  ])
}

//#region sub path filter

function makeSubPathFilter(subPath: unknown) {
  return flow(
    prop('url', ''),
    makeSubPathMatcher(subPath),
  )
}

function makeSubPathMatcher(path: unknown) {
  return (url: string) => {
    const prefixPath = mustString(path)
    const prefix = prefixPath.startsWith('/') ? prefixPath : `/${prefixPath}`

    return url.startsWith(prefix)
  }
}

//#endregion

//#region keyword filter

const engine = new MiniSearch({
  fields: ['title', 'description'],
  idField: 'url',
  tokenize: searchTokenize,
  searchOptions: {
    tokenize: searchTokenize,
  },
})

function searchTokenize(text: string) {
  const segmenterJa = new Intl.Segmenter('zh-CN', { granularity: 'word' })
  const segments = segmenterJa.segment(text)
  return Array.from(segments).map(({ segment }) => segment)
}

function makeKeywordFilter(keyword?: string) {
  return (item: PostInfo) => {
    if (!keyword) {
      return true
    }

    engine.removeAll()
    engine.add(item)

    const res = engine.search(keyword)

    return !!res.length
  }
}

//#endregion

//#region catetgory filter

function makeCategoryFilter(category: unknown) {
  return flow(
    prop('category', ''),
    makeCategoryMatcher(category),
  )
}

function makeCategoryMatcher(category: unknown) {
  return (text: string) => {
    const categoryText = mustString(category)

    return !categoryText || text === categoryText
  }
}

//#endregion

function pipeCondition<T>(conditions: Predicate<T>[]) {
  const reducer = reduce(
    filter<T>(constTrue),
    (acc, cur: Predicate<T>) => flow(acc, filter(cur)),
  )

  return reducer(conditions)
}
