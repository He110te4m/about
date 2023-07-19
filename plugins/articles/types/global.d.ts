import type { PostExtraData } from '../validators/postExtraData'

declare global {
  namespace ArticleModule {
    export interface ArticleInfo extends PostExtraData {
      url: string
    }
  }
}
