import { extname, join, resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import glob from 'fast-glob'
import MarkdownIt from 'markdown-it'
import MarkdownItFrontMatter from 'markdown-it-front-matter'
import { parse as parseYaml } from 'yaml'
import { formatFileToUrl } from '../formatter/url'
import { postExtraDataValidator } from './schema'
import type { GetAllPostsOption, PostExtraData, PostInfo } from './types'

export async function getAllPosts(options: GetAllPostsOption) {
  const infoList = await getPostFileInfoList(options)

  const list = await Promise.allSettled(infoList.map(async ({ path, url }) => {
    const articleInfo = await readArticleInfo(path)
    if (articleInfo) {
      return {
        ...articleInfo,
        url,
      }
    }
  }))

  return list.filter((res): res is PromiseFulfilledResult<PostInfo> => res.status === 'fulfilled' && !!res.value)
    .map(({ value }) => value)
}

async function getPostFileInfoList({ postDir: rootDir, resolveToRoutePath = defaultResolveToRoutePath }: GetAllPostsOption) {
  const files = await glob('**/*.md', { cwd: rootDir })

  return files.map(file => ({
    path: join(rootDir, file),
    url: resolveToRoutePath(file),
  }))
}

async function readArticleInfo(file: string) {
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

function defaultResolveToRoutePath(file: string) {
  const ext = extname(file)

  return formatFileToUrl(file.slice(0, 0 - ext.length))
}
