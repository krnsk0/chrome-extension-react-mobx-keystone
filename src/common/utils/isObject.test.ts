import { describe, expect, it } from 'vitest';

import { isObject } from './isObject';

describe('isObject', () => {
  it('should return true for objects', () => {
    expect(isObject({})).toBeTruthy();
    expect(isObject({ a: 1 })).toBeTruthy();
  });

  it.each([null, undefined, '', 0, true, Symbol(), () => {}])(
    'should return false for %s',
    (input) => {
      expect(isObject(input)).toBeFalsy();
    }
  );
});
