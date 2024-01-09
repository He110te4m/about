import type { Plugin } from 'vite'
import { generatorRSS } from './generator'
import type { RSSGeneratorOption } from './types'

type RSSPluginOption = RSSGeneratorOption

export function createRSSPlugin(option: RSSPluginOption): Plugin {
  return {
    name: 'vite-plugin-he110-rss',

    apply: 'build',

    async buildEnd(error) {
      if (error) {
        return
      }

      const fileName = option.fileName ?? 'rss.xml'
      const RSScontent = await generatorRSS(option)

      this.emitFile({
        fileName,
        name: fileName,
        source: RSScontent,
        type: 'asset',
      })
    },
  }
}
