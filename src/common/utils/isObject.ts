export function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    value != null &&
    typeof value === 'object' &&
    !Array.isArray(value)  )
}


if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true)
      expect(isObject({ a: 1 })).toBe(true)
    })

    it('should return false for non-objects', () => {
      expect(isObject(null)).toBe(false)
      expect(isObject(undefined)).toBe(false)
      expect(isObject('')).toBe(false)
      expect(isObject(0)).toBe(false)
      expect(isObject(true)).toBe(false)
      expect(isObject(Symbol())).toBe(false)
      expect(isObject(() => {})).toBe(false)
    })
  })
}
