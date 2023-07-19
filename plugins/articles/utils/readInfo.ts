import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import MarkdownIt from 'markdown-it'
import MarkdownItFrontMatter from 'markdown-it-front-matter'
import { parse as parseYaml } from 'yaml'
import type { ResolveToRoutePath } from '../types'
import { postExtraDataValidator } from '../validators/postExtraData'

export async function readArticleInfo(file: string, resolveToRoutePath: ResolveToRoutePath) {
  let articleInfo: ArticleModule.ArticleInfo | undefined

  const parser = MarkdownIt().use(MarkdownItFrontMatter, (res) => {
    const info = parseYaml(res)
    const data = postExtraDataValidator.parse(info)
    const url = resolveToRoutePath(file)
    if (url) {
      articleInfo = {
        ...data,
        url,
      }
    }
  })

  const fullPath = resolve(file)
  const content = await readFile(fullPath)
  parser.render(content.toString())

  return articleInfo
}
