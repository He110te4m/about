import { flow } from 'fp-ts/lib/function'
import { Eq, includes } from 'fp-ts/lib/string'

export const filterString = (keyword: string) => flow(String, includes(keyword))
export const eqString = (keyword: string) => (target: string) => !keyword || Eq.equals(keyword, target)
export const eqStringS = (keyword: string) => (target: string) => Eq.equals(keyword, target)
