import { flow } from 'fp-ts/function'
import { includes } from 'fp-ts/string'

export const filterString = (keyword: string) => flow(String, includes(keyword))
