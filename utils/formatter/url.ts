export function formatFileToUrl<T extends string>(file: T): T
export function formatFileToUrl<T extends undefined>(file: T): T
export function formatFileToUrl<T extends string | undefined>(file?: T): string | undefined {
  if (!file) {
    return file
  }

  const path = file.startsWith('/') ? file : `/${file}`

  return path.replace(/[\.\s]/g, '_')
}
