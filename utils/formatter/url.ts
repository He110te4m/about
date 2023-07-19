export function formatFileToUrl(file?: string) {
  return file?.replace(/[\.\s]/g, '_')
}
