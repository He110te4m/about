/// <reference path="./global.d.ts" />

declare module '~articles/*' {
  export const articles: ArticleModule.ArticleInfo[]
}
declare module '~articles' {
  export const articles: ArticleModule.ArticleInfo[]
}
