import { pipe } from 'fp-ts/lib/function'
import type { CustomFn, PostFilterOption, PostOption, PostPagerOption, PostSorterOption } from './types'
import { makePostsFilter } from './filters'
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
  // const { field, direction } = options

  return handleCustomFn(options, (posts: PostInfo[]) => {
    return posts
  })
}

function pagerPosts(options: PostPagerOption = {}) {
  // const { page, size } = options

  return handleCustomFn(options, (posts: PostInfo[]) => {
    return posts
  })
}

function handleCustomFn({ custom }: Required<PostOption>[keyof PostOption], cb: CustomFn) {
  return custom ?? cb
}

//#endregion
