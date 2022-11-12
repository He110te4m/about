import { createFetch } from '@vueuse/core'

export const useFetch = createFetch({
  baseUrl: '/',
  options: {
    beforeFetch(ctx) {
      ctx.url = ctx.url.includes('/blog/') ? formatBlogApi(ctx.url) : ctx.url
    },
  },
})

function formatBlogApi(url: string) {
  return /\.[^\\\/]+$/.test(url) ? url : `${url}.json`
}
