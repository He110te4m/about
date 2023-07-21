export function mustString(data: any, defaultValue = '') {
  return typeof data === 'string'
    ? data
    : String(data ?? defaultValue)
}
