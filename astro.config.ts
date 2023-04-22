import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { netlifyFunctions as deployNetlify } from '@astrojs/netlify'

// https://astro.build/config
export default defineConfig({
  site: 'https://astro.he110.site',
  integrations: [
    mdx(),
    sitemap(),
  ],
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
  output: import.meta.env.DEV ? 'static' : 'server',
  adapter: import.meta.env.DEV ? undefined : deployNetlify(),
})
