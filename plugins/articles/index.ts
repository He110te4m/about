import { extname, join } from 'node:path'
import type { Plugin } from 'vite'
import glob from 'fast-glob'
import { formatFileToUrl } from '../../utils/formatter/url'
import type { PluginOptions } from './types'
import { readArticleInfo } from './utils/readInfo'

export default function createPlugin(options: PluginOptions): Plugin {
  const moduleID = '~articles'
  const resolvedID = `\0${moduleID}`
  const exportName = 'articles'

  return {
    name: 'vite-plugin-read-articles',
    resolveId(id) {
      if (id === moduleID) {
        return resolvedID
      }

      if (id.startsWith(moduleID)) {
        return id.replace(moduleID, resolvedID)
      }
    },
    async load(id) {
      if (id === resolvedID) {
        const posts = await readPosts(options) || []
        posts.sort(({ createdAt: createdAt1 }, { createdAt: createdAt2 }) => createdAt2 - createdAt1)

        return {
          code: `export const ${exportName} = ${JSON.stringify(posts)}`,
        }
      }

      if (id.startsWith(resolvedID)) {
        const dir = id.slice(resolvedID.length + 1)

        return {
          code:
`import { ${exportName} as a } from ${JSON.stringify(moduleID)}

export const ${exportName} = a.filter(({ url }) => url.startsWith(${JSON.stringify(dir)}))
`,
        }
      }
    },
  }
}

async function readPosts({ postDir, resolveToRoutePath = defaultResolveToRoutePath }: PluginOptions): Promise<ArticleModule.ArticleInfo[]> {
  const files = await glob('**/*.md', { cwd: postDir })
  const infoList = files.map(async (file) => {
    const path = join(postDir, file)
    const extraData = await readArticleInfo(path)
    if (extraData) {
      return {
        ...extraData,
        url: resolveToRoutePath(file),
      }
    }
  })

  return Promise.allSettled(infoList)
    .then(
      list =>
        list.filter((res): res is PromiseFulfilledResult<ArticleModule.ArticleInfo> => res.status === 'fulfilled' && !!res.value)
          .map(({ value }) => value),
    )
}

function defaultResolveToRoutePath(file: string) {
  const ext = extname(file)

  return formatFileToUrl(file.slice(0, 0 - ext.length))
}
