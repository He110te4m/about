export function mustString(data: any) {
  return typeof data === 'string'
    ? data
    : String(data ?? '')
}
