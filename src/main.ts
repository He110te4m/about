import { createApp } from 'vue'
import App from './App.vue'

init()

async function init() {
  const app = createApp(App)

  const plugins: Record<string, AppPlugin> = import.meta.glob('./plugins/*.ts', { eager: true })

  await Promise.all(Object.values(plugins).map(plugin => plugin.init({ app })))

  app.mount('#app')
}
