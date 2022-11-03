import type { App } from 'vue'

interface AppInitParams {
  app: App<Element>
}

declare global {
  interface AppPlugin {
    init: (params: AppInitParams) => MaybePromise<void>
  }
}

export {}
