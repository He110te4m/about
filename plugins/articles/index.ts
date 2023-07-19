import { extname, join, resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import type { Plugin } from 'vite'
import glob from 'fast-glob'
import MarkdownIt from 'markdown-it'
import MarkdownItFrontMatter from 'markdown-it-front-matter'
import { parse as parseYaml } from 'yaml'
import { formatFileToUrl } from '../../utils/formatter/url'
import { postExtraDataValidator } from './validator'

export interface PluginOptions {
  postDir: string
  resolveToRoutePath?: (file: string) => string
}

export default function createPlugin(options: PluginOptions): Plugin {
  const moduleID = '~articles'
  const resolvedID = `\0${moduleID}`

  return {
    name: 'vite-plugin-read-articles',
    resolveId(id) {
      if (id.startsWith(moduleID)) {
        return id.replace(moduleID, resolvedID)
      }
    },
    async load(id) {
      if (id.startsWith(resolvedID)) {
        const dir = id.slice(resolvedID.length + 1)

        const posts = await readPosts({ ...options, postDir: join(options.postDir, dir) })
        posts.sort(({ pubDate: pubDate1 }, { pubDate: pubDate2 }) => pubDate2 - pubDate1)

        return {
          code: `export const articles = ${JSON.stringify(posts)}`,
        }
      }
    },
  }
}

async function readPosts({ postDir, resolveToRoutePath = defaultResolveToRoutePath }: PluginOptions): Promise<ArticleModule.ArticleInfo[]> {
  const files = await glob('**/*.md', { cwd: postDir })

  const articleInfoList: ArticleModule.ArticleInfo[] = []

  let currentFile = ''

  const parser = MarkdownIt().use(MarkdownItFrontMatter, (res) => {
    const info = parseYaml(res)
    const data = postExtraDataValidator.parse(info)
    if (currentFile) {
      const url = resolveToRoutePath(currentFile)
      if (url) {
        articleInfoList.push({
          ...data,
          url,
        })
      }
    }
  })

  const data = files.map(async (filename) => {
    const fullPath = resolve(postDir, filename)
    const content = await readFile(fullPath)
    currentFile = filename
    return parser.render(content.toString())
  })

  await Promise.allSettled(data)

  return articleInfoList
}

function defaultResolveToRoutePath(file: string) {
  const ext = extname(file)

  return formatFileToUrl(file.slice(0, 0 - ext.length))!
}
