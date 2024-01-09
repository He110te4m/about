import type { Plugin } from 'vite'
import type { PostInfo } from '~posts'

const exportName = 'posts'
const postListModuleID = '~posts'
const resolvedID = `\0${postListModuleID}`

interface PostListModuleOption {
  posts: PostInfo[]
  checkHMR?: (file: string) => boolean
}

export function createPostListModules({ posts, checkHMR }: PostListModuleOption): Plugin {
  return {
    name: 'vite-plugin-he110-posts',

    resolveId(id) {
      if (id === postListModuleID) {
        return resolvedID
      }
    },

    async load(id) {
      if (id === resolvedID) {
        return {
          code: `export const ${exportName} = ${JSON.stringify(posts)}`,
        }
      }
    },

    handleHotUpdate({ file, server }) {
      // 当 markdown 文件更新时，更新下列表
      if (checkHMR?.(file)) {
        const module = server.moduleGraph.getModuleById(resolvedID)
        module && server.reloadModule(module)
      }
    },
  }
}
