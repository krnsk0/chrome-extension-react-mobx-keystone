// eslint-disable-next-line
export function assertUnreachable(_x: never): never {
  throw new Error("Didn't expect to get here");
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe('assertUnreachable', () => {
    it('should throw an error', () => {
      // @ts-expect-error pass something as never
      expect(() => assertUnreachable('hello')).toThrow();
    });
  });
}
