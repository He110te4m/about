import { defineConfig } from 'cypress'
import { baseURL } from 'cypress/e2e/const'

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
  e2e: {
    baseUrl: baseURL,
    chromeWebSecurity: false,
    specPattern: 'cypress/e2e/**/*.test.*',
    supportFile: false,
  },
})
