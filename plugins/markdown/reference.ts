import type MarkdownIt from 'markdown-it'
import type Token from 'markdown-it/lib/token'

export interface MarkdownReferenceOption {
  idPrefix?: string
  collectionIDPrefix?: string
  classPrefix?: string
  separator?: string
}

const referenceTokenID = 'reference_definition'
const referenceTokenIDPrefix = 'reference'

const referenceCollectionID = 'reference_collection'
const referenceCollectionStartTagID = 'reference_collection_start'
const referenceCollectionEndTagID = 'reference_collection_end'
const referenceCollectionIDPrefix = 'collection'

const formatReferenceIDFnName = 'formatReferenceID'
const formatReferenceCollectionIDFnName = 'formatReferenceCollectionID'

const referenceClassPrefix = 'reference-list'
const referenceSeparator = ':'

const matchRule = /^\@\[(.*?)\]\((.*?)\)/

interface ReferenceTokenData {
  name: string
  url: string
  id: number
  children?: Token[]
}

const referenceSet = new Set<ReferenceTokenData>()

/**
 * register new reference syntax: `@[reference name](reference url)`
 */
export const useMarkdownReference: MarkdownIt.PluginWithOptions<MarkdownReferenceOption> = (md, option = {}) => {
  registerReferenceRule(md)
  registerReferenceRenderer(md, option)
}

/**
 * register new reference syntax parser
 */
function registerReferenceRule(md: MarkdownIt) {
  registerSyntaxParser(md)
  registerSyntaxCollection(md)
}

/** parse inline syntax */
function registerSyntaxParser(md: MarkdownIt) {
  let referenceID = 1

  md.inline.ruler.before(
    // resolve new syntax before resolve link
    'link',
    // new syntax unique name
    referenceTokenID,
    // how to resolve
    (state, silent) => {
      const { pos, src } = state
      const content = src.slice(pos)
      const res = tryToResolveReferenceSyntax(content)
      if (!res) {
        // Syntax parsing failed
        return false
      }

      const { reference, name, url } = res

      // Parse the subsequent content of the syntax block
      state.pos += reference.length
      if (!silent) {
        const childrenTokens: Token[] = []
        state.md.inline.parse(
          name,
          state.md,
          state.env,
          childrenTokens,
        )
        const tokenData: ReferenceTokenData = {
          id: referenceID++,
          name: md.renderer.renderInline(childrenTokens, md.options, state.env),
          url,
        }
        referenceSet.add(tokenData)

        const token = state.push(referenceTokenID, '', 0)
        token.meta = tokenData
      }

      // Notify the tokenizer that parsing is successful
      return true
    },
    { alt: ['paragraph', 'reference'] },
  )
}

/** push all reference to article tail */
function registerSyntaxCollection(md: MarkdownIt) {
  md.core.ruler.after('inline', referenceCollectionID, (state) => {
    const tokens = Array.from(referenceSet)
    referenceSet.clear()
    if (!tokens.length) {
      return false
    }

    state.tokens.push(new state.Token(referenceCollectionStartTagID, '', 1))

    tokens.forEach((token) => {
      const renderToken = new state.Token(referenceCollectionID, '', 0)
      renderToken.meta = token
      state.tokens.push(renderToken)
    })

    state.tokens.push(new state.Token(referenceCollectionEndTagID, '', -1))

    return true
  })
}

/**
 * Check whether the syntax is legal
 */
function tryToResolveReferenceSyntax(str: string) {
  const match = str.match(matchRule)
  if (!match) {
    return false
  }

  const [reference, name, url] = match
  if (!name || !url) {
    return false
  }

  return {
    reference,
    name,
    url,
  }
}

/**
 * register new reference syntax renderer
 */
function registerReferenceRenderer(md: MarkdownIt, option: MarkdownReferenceOption) {
  registerUtilsFns(md, option)
  registerInlineReferenceRenderer(md, option)
  registerReferenceCollectionRenderer(md, option)
}

function registerUtilsFns(md: MarkdownIt, option: MarkdownReferenceOption) {
  const {
    idPrefix = referenceTokenIDPrefix,
    collectionIDPrefix = referenceCollectionIDPrefix,
  } = option

  md.renderer.rules[formatReferenceIDFnName] = (tokens, idx, _options, _env, _slf) => {
    const { id } = tokens[idx].meta ?? {}

    return id
      ? `${collectionIDPrefix}-${id}`
      : ''
  }

  md.renderer.rules[formatReferenceCollectionIDFnName] = (tokens, idx, _options, _env, _slf) => {
    const { id } = tokens[idx].meta ?? {}

    return id
      ? `${idPrefix}-${id}`
      : ''
  }
}

function registerInlineReferenceRenderer(md: MarkdownIt, option: MarkdownReferenceOption) {
  const { classPrefix = referenceClassPrefix } = option

  md.renderer.rules[referenceTokenID] = (tokens, idx, options, env, slf) => {
    const referenceID = slf.rules[formatReferenceIDFnName]?.(tokens, idx, options, env, slf)
    const collectionID = slf.rules[formatReferenceCollectionIDFnName]?.(tokens, idx, options, env, slf)
    const { id, name } = tokens[idx].meta ?? {}

    return [referenceID, collectionID, id, name].every(item => item)
      ? `
<span>
  <span>${name}</span>
  <sup class="${renderSupCls(classPrefix)}">
    <a id="${collectionID}" href="#${referenceID}">${renderSupText(id)}</a>
  </sup>
</span>
`.trim()
      : ''
  }
}

function registerReferenceCollectionRenderer(md: MarkdownIt, option: MarkdownReferenceOption) {
  registerReferenceCollectionStartRenderer(md, option)
  registerReferenceCollectionListRenderer(md, option)
  registerReferenceCollectionEndRenderer(md)
}

function registerReferenceCollectionStartRenderer(md: MarkdownIt, option: MarkdownReferenceOption) {
  const { classPrefix = referenceClassPrefix } = option

  md.renderer.rules[referenceCollectionStartTagID] = (_tokens, _idx, _options, env, _slf) => {
    return !env.ignoreReferenceCollection
      ? `<ol class="${classPrefix}">`
      : ''
  }
}

function registerReferenceCollectionListRenderer(md: MarkdownIt, option: MarkdownReferenceOption) {
  const {
    classPrefix = referenceClassPrefix,
    separator = referenceSeparator,
  } = option

  md.renderer.rules[referenceCollectionID] = (tokens, idx, options, env, slf) => {
    const { name, url, id } = tokens[idx].meta ?? {}

    const referenceID = slf.rules[formatReferenceIDFnName]?.(tokens, idx, options, env, slf)
    const collectionID = slf.rules[formatReferenceCollectionIDFnName]?.(tokens, idx, options, env, slf)

    if (env.ignoreReferenceCollection || [name, url, id, referenceID, collectionID].some(item => !item)) {
      return ''
    }

    return `
<li id="${referenceID}" class="${renderItemCls(classPrefix)}">
  <a href="#${collectionID}">${renderSupText(id)}</a>
  <span class="${renderItemSepCls(classPrefix)}">${separator}</span>
  <a href="${url}">${name}</a>
</li>
`.trim()
  }
}

function registerReferenceCollectionEndRenderer(md: MarkdownIt) {
  md.renderer.rules[referenceCollectionEndTagID] = (_tokens, _idx, _options, env, _slf) => {
    return !env.ignoreReferenceCollection
      ? '</ol>'
      : ''
  }
}

function renderSupText(id: number) {
  return `[${id}]`
}

function renderSupCls(classPrefix: string) {
  return `${classPrefix}__sup`
}

function renderItemCls(classPrefix: string) {
  return `${classPrefix}__item`
}

function renderItemSepCls(classPrefix: string) {
  return `${renderItemCls(classPrefix)}__separator`
}
