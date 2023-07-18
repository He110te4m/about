import type { Plugin } from 'vite'
import glob from 'fast-glob'

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
      if (id === moduleID) {
        return resolvedID
      }
    },
    async load(id) {
      if (id === resolvedID) {
        const posts = await readPosts(options)

        return {
          code: `export const articles = ${JSON.stringify(posts)}`,
        }
      }
    },
  }
}

async function readPosts({ postDir, resolveToRoutePath = file => file }: PluginOptions) {
  return await glob('*.md', { cwd: postDir })

  // return []
}
