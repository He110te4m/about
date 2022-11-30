import { Eq as EqString } from 'fp-ts/string'
import { Eq as EqNumber } from 'fp-ts/number'
import { Eq as EqBoolean } from 'fp-ts/boolean'

export const includesString = (keyword: string) => (text: string) => text.includes(keyword)

export const equalString = (text1: string) => (text2: unknown) => isString(text2) && EqString.equals(text1, text2)
export const equalNumber = (num1: number) => (num2: unknown) => isNumber(num2) && EqNumber.equals(num1, num2)
export const equalBoolean = (bool1: boolean) => (bool2: unknown) => isBoolean(bool2) && EqBoolean.equals(bool1, bool2)
