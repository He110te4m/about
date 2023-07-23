export function mustDate(date: unknown, defaultValue = new Date()): Date {
  if (date instanceof Date) {
    return date
  }

  const parseDate = new Date(String(date))
  return Number.isNaN(parseDate.getTime()) ? defaultValue : parseDate
}

export function getYear(date: Date) {
  return date.getFullYear()
}

export function getTime(date: Date) {
  return date.getTime()
}
