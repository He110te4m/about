declare module '~articles' {
  export interface ArticleInfo {
    title: string
    desc: string
    url: string
    createAt: number
    updateAt: number
  }

  export const articles: ArticleInfo[]
}
