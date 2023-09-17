import { describe, expect, it } from 'vitest';

import { assertUnreachable } from './assertUnreachable';

describe('assertUnreachable', () => {
  it('should throw an error', () => {
    // @ts-expect-error pass something as never
    expect(() => assertUnreachable('hello')).toThrow();
  });
});
