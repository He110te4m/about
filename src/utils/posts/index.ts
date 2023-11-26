import { pipe } from 'fp-ts/lib/function'
import type { CustomFn, PostFilterOption, PostOption, PostPagerOption, PostSorterOption } from './types'
import { makePostsFilter } from './filters'
import { makePostsPager } from './pager'
import { makePostsSorter } from './sort'
import { type PostInfo, posts } from '~posts'

export function getPosts(options: PostOption = {}) {
  return pipe(
    posts,
    filterPosts(options.filter),
    sortPosts(options.sorter),
    pagerPosts(options.pager),
  )
}

//#region step by step handle posts

function filterPosts(options: PostFilterOption = {}) {
  return handleCustomFn(options, (posts: PostInfo[]) => {
    const filterFn = makePostsFilter(options)

    return filterFn(posts)
  })
}

function sortPosts(options: PostSorterOption = {}) {
  return handleCustomFn(options, (posts: PostInfo[]) => {
    const sorterFn = makePostsSorter(options)

    return sorterFn(posts)
  })
}

function pagerPosts(options: PostPagerOption = {}) {
  return handleCustomFn(options, (posts: PostInfo[]) => {
    const pagerFn = makePostsPager(options)

    return pagerFn(posts)
  })
}

function handleCustomFn({ custom }: Required<PostOption>[keyof PostOption], cb: CustomFn) {
  return custom ?? cb
}

//#endregion
