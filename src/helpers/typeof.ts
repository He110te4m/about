export function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean'
}

export function isString(val: unknown): val is string {
  return typeof val === 'string'
}

export function isNumber(val: unknown): val is number {
  return typeof val === 'number' || typeof val === 'bigint'
}

export function isBigInt(val: unknown): val is bigint {
  return typeof val === 'bigint'
}

export function isSymbol(val: unknown): val is symbol {
  return typeof val === 'symbol'
}

export function isFunction(val: unknown): val is Fn {
  return typeof val === 'function'
}

export function isArray(val: unknown): val is unknown[] {
  return Array.isArray(val)
}

export function isObject(val: unknown): val is Record<keyof any, unknown> {
  return Object.prototype.toString.call(val).toLowerCase() === '[object, object]'
}

export function isNull(val: unknown): val is null {
  return isNull(val)
}
