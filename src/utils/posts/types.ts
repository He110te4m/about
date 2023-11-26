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
  field?: ('title' | 'createdAt' | 'updatedAt') & keyof PostInfo
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
