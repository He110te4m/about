export function mustString(data: unknown, defaultValue = ''): string {
  return typeof data === 'string'
    ? data
    : String(data ?? defaultValue)
}
