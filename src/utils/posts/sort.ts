import { sortBy } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import { Ord as OrdString } from 'fp-ts/lib/string'
import { Ord as OrdDate } from 'fp-ts/lib/Date'
import { contramap, reverse } from 'fp-ts/lib/Ord'
import type { PostSorterOption } from './types'
import type { PostInfo } from '~posts'

const nilDate = new Date()

const sortByTitle = pipe(
  OrdString,
  contramap((info: PostInfo) => info.title),
)
const sortByCreatedAt = pipe(
  OrdDate,
  contramap((info: PostInfo) => new Date(info.createdAt)),
)
const sortByUpdatedAt = pipe(
  OrdDate,
  contramap((info: PostInfo) => info.updatedAt ? new Date(info.updatedAt) : nilDate),
)

const sortFieldMap: Record<Required<PostSorterOption>['field'], (typeof sortByTitle | typeof sortByCreatedAt | typeof sortByUpdatedAt)> = {
  title: sortByTitle,
  createdAt: sortByCreatedAt,
  updatedAt: sortByUpdatedAt,
}

export function makePostsSorter(options: PostSorterOption) {
  return pipe(
    options,
    getSortFn,
    sortBy,
  )
}

function getSortFn({ field = 'createdAt', direction }: PostSorterOption) {
  const sortFn = sortFieldMap[field]

  return [
    direction === 'DESC' ? reverse(sortFn) : sortFn,
  ]
}
