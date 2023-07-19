export function formatFileToUrl<T extends string>(file: T): T
export function formatFileToUrl<T extends undefined>(file: T): T
export function formatFileToUrl<T extends string | undefined>(file?: T): string | undefined {
  return file?.replace(/[\.\s]/g, '_')
}
