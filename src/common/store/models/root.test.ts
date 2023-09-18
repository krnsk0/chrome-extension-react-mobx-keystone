import { observe } from 'mobx';
import { describe, expect, it } from 'vitest';

import { Root } from './root';

describe('the root store model', () => {
  it('should initialize from an empty snapshot without throwing', () => {
    expect(() => new Root({})).not.toThrow();
  });

  /**
   * This is useful in React where we can't await loading from a storage provider
   * and we need to be able to e.g. show a loading spinner while we wait for this
   */
  it('should allow the caller to observe the load state of the model', () => {
    const store = new Root({});
    let loaded = true;
    observe(store, 'isLoading', () => {
      loaded = store.isLoading;
    });
    expect(loaded).toBe(true);
    store.markLoadComplete();
    expect(loaded).toBe(false);
  });
});
