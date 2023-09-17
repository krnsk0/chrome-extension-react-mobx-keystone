import { renderHook } from '@testing-library/react';
import { isRoot } from 'mobx-keystone';
import { describe, expect, it } from 'vitest';

import { useStore } from './useStore';

describe('useStore', () => {
  it('should return the root store', () => {
    const { result } = renderHook(() => useStore());

    expect(isRoot(result.current)).toBe(true);
  });
});
