import { marked } from 'marked'

// init marked
setMarkedOptions({
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartypants: false,
  xhtml: false,
  headerPrefix: 'article-title-',
})

export { marked }

function setMarkedOptions(options: marked.MarkedOptions) {
  marked.setOptions(options)
}
