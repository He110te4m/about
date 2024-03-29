import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import generateSitemap from 'vite-ssg-sitemap'
import Layouts from 'vite-plugin-vue-layouts'
import Markdown from 'vite-plugin-vue-markdown'
import { VitePWA } from 'vite-plugin-pwa'
import wasm from 'vite-plugin-wasm'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'

// import VueDevTools from 'vite-plugin-vue-devtools'
import LinkAttributes from 'markdown-it-link-attributes'
import Unocss from 'unocss/vite'
import Shiki from 'markdown-it-shiki'
import Emoji from 'markdown-it-emoji'
import Anchor from 'markdown-it-anchor'

// @ts-expect-error The libs don't have types.
import TOC from 'markdown-it-table-of-contents'

import WebfontDownload from 'vite-plugin-webfont-dl'
import { getAllPosts } from './utils/post'
import { formatFileToUrl } from './utils/formatter/url'
import InjectPosts from './plugins/posts'
import createRSSPlugin from './plugins/rss'
import { description, title } from './src/configs'
import { useMarkdownReference } from './plugins/markdown/reference'

export default defineConfig(async () => {
  const posts = await getAllPosts({
    postDir: 'src/pages',
  })

  return {
    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
      },
    },

    plugins: [
      Vue({
        include: [/\.vue$/, /\.md$/],
      }),

      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        extensions: ['vue', 'md'],
        onRoutesGenerated(routes) {
          routes.forEach((item: any) => {
            item.path = formatFileToUrl(item.path)
          })

          return routes
        },
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts({
        defaultLayout: 'Article',
      }),

      // // https://github.com/antfu/unplugin-auto-import
      // AutoImport({
      //   imports: [
      //     'vue',
      //     'vue-router',
      //     'vue-i18n',
      //     '@vueuse/head',
      //     '@vueuse/core',
      //   ],
      //   dts: 'types/auto-imports.d.ts',
      //   dirs: [
      //     'src/configs',
      //     'src/composables/**',
      //     'src/stores',
      //     'src/utils/**',
      //   ],
      //   vueTemplate: true,
      // }),

      // // https://github.com/antfu/unplugin-vue-components
      // Components({
      //   // allow auto load markdown components under `./src/components/`
      //   extensions: ['vue', 'md'],
      //   // allow auto import and register components used in markdown
      //   include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      //   dts: 'types/components.d.ts',
      // }),

      // https://github.com/antfu/unocss
      // see uno.config.ts for config
      Unocss(),

      // https://github.com/antfu/vite-plugin-vue-markdown
      // Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
      Markdown({
        wrapperClasses: 'prose prose-md text-left',
        headEnabled: true,
        markdownItSetup(md) {
          // https://prismjs.com/
          md.use(Shiki, {
            theme: {
              light: 'vitesse-light',
              dark: 'vitesse-dark',
            },
            highlightLines: true,
          })
          md.use(LinkAttributes, {
            matcher: (link: string) => /^https?:\/\//.test(link),
            attrs: {
              target: '_blank',
              rel: 'noopener',
            },
          })

          md.use(useMarkdownReference)

          md.use(Emoji)

          md.use(Anchor)

          md.use(TOC)
        },
      }),

      // https://github.com/antfu/vite-plugin-pwa
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'rss.xml', 'sitemap.xml'],
        workbox: {
          navigateFallbackDenylist: [/^\/rss\.xml/, /^\/sitemap\.xml/],
        },
        manifest: {
          name: title,
          short_name: 'He110',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),

      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      VueI18n({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: true,
        include: [path.resolve(__dirname, 'locales/**')],
      }),

      // https://github.com/feat-agency/vite-plugin-webfont-dl
      WebfontDownload(),

      wasm(),

      // // https://github.com/webfansplz/vite-plugin-vue-devtools
      // VueDevTools(),

      InjectPosts({
        posts,
        checkHMR: file => file.endsWith('.md'),
      }),

      createRSSPlugin({
        posts,
        rss: {
          title,
          description,
          trailingSlash: true,
          site: 'https://me.he110.site',
        },
      }),
    ],

    // https://github.com/vitest-dev/vitest
    test: {
      include: ['test/**/*.test.ts'],
      environment: 'jsdom',
      deps: {
        inline: ['@vue', '@vueuse', 'vue-demi'],
      },
    },

    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      crittersOptions: {
        reduceInlineStyles: false,
      },
      onFinished() {
        generateSitemap()
      },
    },

    ssr: {
      // TODO: workaround until they support native ESM
      noExternal: ['workbox-window', /vue-i18n/],
    },
  }
})
