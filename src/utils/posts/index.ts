import { flow, pipe } from 'fp-ts/lib/function'
import { filter } from 'fp-ts/lib/Array'
import type { CustomFn, PostFilterOption, PostOption, PostPagerOption, PostSorterOption } from './types'
import { makePostsFilter } from './filters'
import { makePostsPager } from './pager'
import { makePostsSorter } from './sort'
import { eqString } from '~/utils/filters/string'
import { prop } from '~/utils/filters/record'
import { type PostInfo, posts } from '~posts'

export function getPosts(options: PostOption = {}) {
  return pipe(
    posts,
    filterPosts(options.filter),
    sortPosts(options.sorter),
    pagerPosts(options.pager),
  )
}

export function getPost(url?: string) {
  const matchedPosts = getPosts({
    filter: {
      custom: filter(
        flow(
          prop('url', ''),
          eqString(url),
        ),
      ),
    },
  })

  return matchedPosts[0]
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
