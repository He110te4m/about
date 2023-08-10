import { type MaybeRefOrGetter } from '@vueuse/core'
import { flow } from 'fp-ts/lib/function'

export function makeKeywordFilter(keyword: MaybeRefOrGetter<unknown>) {
  return anyPass([
    flow(
      prop('title', ''),
      makeKeywordMatcher(keyword),
    ),
    flow(
      prop('description', ''),
      makeKeywordMatcher(keyword),
    ),
  ])
}

function makeKeywordMatcher(keyword: MaybeRefOrGetter<unknown>) {
  return (text: string) => text.includes(mustString(unref(toRef(keyword))))
}

export function makeCategoryFilter(category: MaybeRefOrGetter<unknown>) {
  return flow(
    prop('category', ''),
    makeCategoryMatcher(category),
  )
}

function makeCategoryMatcher(category: MaybeRefOrGetter<unknown>) {
  return (text: string) => {
    const categoryText = mustString(unref(toRef(category)))

    return !categoryText || text === categoryText
  }
}
