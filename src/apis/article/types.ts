export interface Article {
  id: number | string
  title: string
  category: string
  createdAt: number
  content: string

  description?: string | string[]
  tags?: string[]
  updatedAt?: number
}
