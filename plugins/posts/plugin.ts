import type { Plugin } from 'vite'
import { type GetAllPostsOption, getAllPosts } from '../../utils/post'
import { exportName, postListModuleID } from './const'

const resolvedID = `\0${postListModuleID}`

type PluginOptions = GetAllPostsOption

export function createPostListModules(options: PluginOptions): Plugin {
  return {
    name: 'vite-plugin-he110-posts',

    resolveId(id) {
      if (id === postListModuleID) {
        return resolvedID
      }
    },

    async load(id) {
      if (id === resolvedID) {
        const posts = await getAllPosts(options) || []

        return {
          code: `export const ${exportName} = ${JSON.stringify(posts)}`,
        }
      }
    },

    handleHotUpdate({ file, server }) {
      // 当 markdown 文件更新时，更新下列表
      if (file.endsWith('.md')) {
        const module = server.moduleGraph.getModuleById(resolvedID)
        module && server.reloadModule(module)
      }
    },
  }
}
