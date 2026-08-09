export function isNotNull<Value>(value: Value | null) : value is Value {
  return value !== null
}
