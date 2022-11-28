/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
  plugins: [
    Vue({
      reactivityTransform: true,
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      dirs: [
        'src/pages',
        {
          dir: 'src/components/**/demo',
          baseRoute: 'demo/components',
        },
        {
          dir: 'src/composables/**/demo',
          baseRoute: 'demo/composables',
        },
      ],
      exclude: [
        '(components|composables)/**/!(index).vue',
        '_*',
      ],
      extensions: ['vue'],
      onRoutesGenerated(routes) {
        routes.forEach((route) => {
          if (['components', 'composables'].every(dirName => !route.component.includes(dirName))) {
            return
          }

          route.path = `/demo${route.component.slice(4, 0 - '/index.vue'.length)}`
          route.name = route.path
            .split(/[\\\/]/g)
            .map((dir: string) => dir.charAt(0).toUpperCase() + dir.slice(1))
            .join('')
        })

        return routes
      },
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/core',
      ],
      dts: 'src/types/auto-import.d.ts',
      dirs: [
        './src/apis/*',
        './src/composables',
        './src/composables/**/src',
        './src/helpers',
        './src/operators',
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: 'src/types/components.d.ts',
      globs: [
        'src/components/**/src/*.vue',
      ],
      resolvers: [
        HeadlessUiResolver(),
      ],
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    Inspect(),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'c8',
      reporter: ['json', 'html'],
      reportsDirectory: 'coverages',
      include: [
        'src/components/**/src',
        'src/composables/**/src',
      ],
    },
  },
})
