import { createRouter, createWebHashHistory } from 'vue-router'
import routes from '~pages'

export const init: AppPlugin['init'] = ({ app }) => {
  app.use(getRouter())
}

function getRouter() {
  if (import.meta.env.DEV) {
    window.console.log('routes: ', routes)
  }

  return createRouter({
    history: createWebHashHistory(),
    routes,
  })
}
