import type { PostExtraData } from './validator'

declare global {
  namespace ArticleModule {
    export interface ArticleInfo extends PostExtraData {
      url: string
    }
  }
}
