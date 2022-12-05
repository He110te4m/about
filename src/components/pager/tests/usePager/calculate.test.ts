import { min } from 'fp-ts/Ord'
import { Ord } from 'fp-ts/number'
import { describe, expect, it } from 'vitest'
import { usePager } from '../..'
import { getMatchPageMsg, getMatchSepMsg, matchPage, matchSep } from '../utils'

describe('normal usePager', () => {
  it('calculate normal pager', () => {
    const maxPage = 3

    testPager({
      currentPage: 2,
      maxPage,
      showPageItemNum: maxPage,
      hasPrev: false,
      hasLast: false,
    })
  })

  it('calculate center pager', () => {
    testPager({
      currentPage: 3,
      maxPage: 5,
      showPageItemNum: 3,
      hasPrev: true,
      hasLast: true,
    })
  })

  it('calculate left pager', () => {
    testPager({
      currentPage: 2,
      maxPage: 5,
      showPageItemNum: 3,
      hasPrev: false,
      hasLast: true,
    })
  })

  it('calculate right pager', () => {
    testPager({
      currentPage: 4,
      maxPage: 5,
      showPageItemNum: 3,
      hasPrev: true,
      hasLast: false,
    })
  })
})

describe('calculate limit pager', () => {
  it ('calculate left limit pager', () => {
    testPager({
      currentPage: 1,
      maxPage: 5,
      showPageItemNum: 3,
      hasPrev: false,
      hasLast: true,
    })
  })

  it ('calculate right limit pager', () => {
    const maxPage = 5

    testPager({
      currentPage: maxPage,
      maxPage,
      showPageItemNum: 3,
      hasPrev: true,
      hasLast: false,
    })
  })

  it ('calculate less limit pager', () => {
    testPager({
      currentPage: 2,
      maxPage: 3,
      showPageItemNum: 5,
      hasPrev: false,
      hasLast: false,
    })
  })
})

interface TestPagerOptions {
  currentPage: number
  maxPage: number
  showPageItemNum: number
  hasPrev: boolean
  hasLast: boolean
}

function testPager(options: TestPagerOptions) {
  const { currentPage, maxPage, showPageItemNum } = options
  const { pages } = usePager(currentPage, maxPage, { showPageItemNum })

  const { sepCount, pageCount } = getCount(options)

  expect(pages.value).toHaveLength(sepCount + pageCount)

  const { matchPageMsg, matchSepMsg } = getMatchMsg(options)

  expect(matchPage(pages.value)).toEqual(matchPageMsg)
  expect(matchSep(pages.value)).toEqual(matchSepMsg)

  return pages
}

function getMatchMsg(options: TestPagerOptions) {
  const { sepCount, pageCount } = getCount(options)

  const matchSepMsg = getMatchSepMsg(sepCount)
  const matchPageMsg = getMatchPageMsg(pageCount)

  return {
    matchSepMsg,
    matchPageMsg,
  }
}

function getCount({ hasPrev, hasLast, showPageItemNum, maxPage }: TestPagerOptions) {
  const appendCount = Number(hasPrev) + Number(hasLast)
  const pageCount = hasPrev || hasLast ? showPageItemNum + appendCount : min(Ord)(maxPage, showPageItemNum)
  const sepCount = appendCount

  return {
    pageCount,
    sepCount,
  }
}
