import { extname, join } from 'node:path'
import type { Plugin } from 'vite'
import glob from 'fast-glob'
import { formatFileToUrl } from '../../utils/formatter/url'
import type { PluginOptions } from './types'
import { readArticleInfo } from './utils/readInfo'

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

        const posts = await readPosts({ ...options, postDir: join(options.postDir, dir) }) || []
        posts.sort(({ createdAt: createdAt1 }, { createdAt: createdAt2 }) => createdAt2 - createdAt1)

        return {
          code: `export const articles = ${JSON.stringify(posts)}`,
        }
      }
    },
  }
}

async function readPosts({ postDir, resolveToRoutePath = defaultResolveToRoutePath }: PluginOptions): Promise<ArticleModule.ArticleInfo[]> {
  const files = await glob('**/*.md', { cwd: postDir })
  const infoList = files.map((file) => {
    const path = join(postDir, file)
    return readArticleInfo(path, resolveToRoutePath)
  })

  return Promise.allSettled(infoList)
    .then(
      list =>
        list.filter((res): res is PromiseFulfilledResult<ArticleModule.ArticleInfo> => res.status === 'fulfilled')
          .map(({ value }) => value),
    )
}

function defaultResolveToRoutePath(file: string) {
  const ext = extname(file)

  return formatFileToUrl(file.slice(0, 0 - ext.length))
}
