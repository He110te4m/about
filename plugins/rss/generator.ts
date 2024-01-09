import { URL } from 'node:url'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import type { RSSGeneratorOption, RSSItem, RSSOption } from './types'
import { RSSGeneratorOptionValidator } from './schema'
import type { PostInfo } from '~posts'

type XMLClassParams = ConstructorParameters<typeof XMLBuilder>
const builderParams: XMLClassParams = [
  {
    ignoreAttributes: false,
    suppressEmptyNode: true,
    suppressBooleanAttributes: false,
  },
]

const builder = new XMLBuilder(...builderParams)
const parser = new XMLParser(...builderParams)

const XMLContentNamespace = 'http://purl.org/rss/1.0/modules/content/'

export async function generatorRSS(option: RSSGeneratorOption) {
  const { posts, rss: RSSOption } = await validateRSSOption(option)
  if (!RSSOption.items) {
    RSSOption.items = posts.map(getRSSItemByPost)
  }

  return generatorRSSXML(RSSOption)
}

async function validateRSSOption(option: RSSGeneratorOption) {
  const parsedResult = await RSSGeneratorOptionValidator.safeParseAsync(option)
  if (parsedResult.success) {
    return parsedResult.data
  }

  // TODO: handle option parse error
  throw new Error('[RSS]: parse RSS option error')
}

function getRSSItemByPost(post: PostInfo): RSSItem {
  return {
    title: post.title,
    description: post.description,
    pubDate: new Date(post.createdAt),
    link: post.url,
  }
}

function generatorRSSXML(option: RSSOption): string {
  const root: any = createRSSXMLBaseInfo()
  const withStyleSheet = createRSSXMLStyleSheet(option)
  const withXmlns = createRSSXMLXmlns(option)
  const withChannelInfo = createRSSXMLChannelInfo(option)
  const withChannelItems = createRSSXMLChannelItems(option)

  return builder.build(
    {
      ...root,
      ...withStyleSheet,
      rss: {
        ...root.rss,
        ...withXmlns.rss,
        channel: {
          ...withChannelInfo.rss.channel,
          ...withChannelItems.rss.channel,
        },
      },
    },
  )
}

function createRSSXMLBaseInfo() {
  return {
    '?xml': {
      '@_version': '1.0',
      '@_encoding': 'UTF-8',
    },
    'rss': {
      '@_version': '2.0',
    },
  }
}

function createRSSXMLStyleSheet(option: RSSOption) {
  const root: any = {}

  // stylesheet
  if (typeof option.stylesheet === 'string') {
    const isXSL = /\.xsl$/i.test(option.stylesheet)
    root['?xml-stylesheet'] = {
      '@_href': option.stylesheet,
    }

    if (isXSL) {
      root['?xml-stylesheet']['@_type'] = 'text/xsl'
    }
  }

  return root
}

function createRSSXMLXmlns(option: RSSOption) {
  const root: any = {
    rss: {},
  }

  if (!option.xmlns?.content && option.items?.some(item => item.content)) {
    root.rss['@_xmlns:content'] = XMLContentNamespace
  }
  if (option.xmlns) {
    for (const [key, content] of Object.entries(option.xmlns)) {
      root.rss[`@_xmlns:${key}`] = content
    }
  }

  return root
}

function createRSSXMLChannelInfo(option: RSSOption) {
  const root: any = {
    rss: {},
  }

  root.rss.channel = {
    title: option.title,
    description: option.description,
    link: createCanonicalURL(option.site, option.trailingSlash),
  }

  if (typeof option.customData === 'string') {
    Object.assign(
      root.rss.channel,
      parser.parse(`<channel>${option.customData}</channel>`).channel,
    )
  }

  return root
}

function createRSSXMLChannelItems(option: RSSOption) {
  const root: any = {
    rss: {
      channel: {
        item: option.items?.map(makeRSSItemConvertor(option)) ?? [],
      },
    },
  }

  return root
}

function makeRSSItemConvertor(option: RSSOption) {
  // TODO: split code
  return (RSSItem: RSSItem) => {
    const item: Record<keyof any, unknown> = {}
    if (RSSItem.title) {
      item.title = RSSItem.title
    }
    if (RSSItem.description) {
      item.description = RSSItem.description
    }
    if (typeof RSSItem.link === 'string') {
      const link = isValidURL(RSSItem.link)
        ? RSSItem.link
        : createCanonicalURL(RSSItem.link, option.trailingSlash, option.site).href
      item.link = link
      item.guid = {
        '#text': link,
        '@_isPermaLink': 'true',
      }
    }
    if (RSSItem.pubDate) {
      item.pubDate = RSSItem.pubDate.toUTCString()
    }
    if (typeof RSSItem.content === 'string') {
      item['content:encoded'] = RSSItem.content
    }

    if (typeof RSSItem.customData === 'string') {
      Object.assign(item, parser.parse(`<item>${RSSItem.customData}</item>`).item)
    }
    if (Array.isArray(RSSItem.categories)) {
      item.category = RSSItem.categories
    }
    if (typeof RSSItem.author === 'string') {
      item.author = RSSItem.author
    }
    if (typeof RSSItem.commentsUrl === 'string') {
      item.comments = isValidURL(RSSItem.commentsUrl)
        ? RSSItem.commentsUrl
        : createCanonicalURL(RSSItem.commentsUrl, option.trailingSlash, option.site).href
    }
    if (RSSItem.source) {
      item.source = parser.parse(
        `<source url="${RSSItem.source.url}">${RSSItem.source.title}</source>`,
      ).source
    }
    if (RSSItem.enclosure) {
      const enclosureURL = isValidURL(RSSItem.enclosure.url)
        ? RSSItem.enclosure.url
        : createCanonicalURL(RSSItem.enclosure.url, option.trailingSlash, option.site).href
      item.enclosure = parser.parse(
        `<enclosure url="${enclosureURL}" length="${RSSItem.enclosure.length}" type="${RSSItem.enclosure.type}"/>`,
      ).enclosure
    }

    return item
  }
}

/** Normalize URL to its canonical form */
export function createCanonicalURL(
  url: string,
  trailingSlash?: RSSOption['trailingSlash'],
  base?: string,
): URL {
  let pathname = url.replace(/\/index.html$/, '') // index.html is not canonical
  if (trailingSlash === false) {
    // remove the trailing slash
    pathname = pathname.replace(/(\/+)?$/, '')
  } else if (!getUrlExtension(url)) {
    // add trailing slash if there’s no extension or `trailingSlash` is true
    pathname = pathname.replace(/(\/+)?$/, '/')
  }

  pathname = pathname.replace(/\/+/g, '/') // remove duplicate slashes (URL() won’t)
  return new URL(pathname, base)
}

function getUrlExtension(url: string) {
  const lastDot = url.lastIndexOf('.')
  const lastSlash = url.lastIndexOf('/')
  return lastDot > lastSlash ? url.slice(lastDot + 1) : ''
}

/** Check if a URL is already valid */
function isValidURL(url: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(url)
    return true
  } catch (e) { }
  return false
}
