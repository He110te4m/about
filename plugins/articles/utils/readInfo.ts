import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import MarkdownIt from 'markdown-it'
import MarkdownItFrontMatter from 'markdown-it-front-matter'
import { parse as parseYaml } from 'yaml'
import { type PostExtraData, postExtraDataValidator } from '../validators/postExtraData'

export async function readArticleInfo(file: string) {
  let articleInfo: PostExtraData | undefined

  const parser = MarkdownIt().use(MarkdownItFrontMatter, (res) => {
    const info = parseYaml(res)
    const data = postExtraDataValidator.parse(info)
    if (data) {
      articleInfo = data
    }
  })

  const fullPath = resolve(file)
  const content = await readFile(fullPath)
  parser.render(content.toString())

  return articleInfo
}
