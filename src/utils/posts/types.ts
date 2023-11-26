import type { PostInfo } from '~posts'

export type CustomFn = (posts: PostInfo[]) => PostInfo[]

export interface PostFilterOption {
  subPath?: string
  category?: string
  keyword?: string
  custom?: CustomFn
}

export type SorterDirction = 'ASC' | 'DESC'

export interface PostSorterOption {
  field?: keyof Omit<PostInfo, 'url'>
  direction?: SorterDirction
  custom?: CustomFn
}

export interface PostPagerOption {
  page?: number
  size?: number
  custom?: CustomFn
}

export interface PostOption {
  filter?: PostFilterOption
  sorter?: PostSorterOption
  pager?: PostPagerOption
}
