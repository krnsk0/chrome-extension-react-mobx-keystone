import { render } from '@testing-library/react';
import { assertIsTreeNode, isRoot } from 'mobx-keystone';
import { describe, expect, it, Mock, vi } from 'vitest';

import { nextTick } from '../../../testing/nextTick';
import { Root } from './models/root';
import { startStoreSync } from './startStoreSync';
import StoreProvider, { StoreContext } from './storeProvider';

vi.mock('./startStoreSync', async () => {
  const original = await vi.importActual<{
    startStoreSync: typeof startStoreSync;
  }>('./startStoreSync.js');
  return {
    startStoreSync: vi.fn().mockImplementation(original.startStoreSync),
  };
});

describe('the StoreProvide', () => {
  it('should pass an instance of the root store down to child components', () => {
    let store: Root | undefined = undefined;
    render(
      <StoreProvider>
        <StoreContext.Consumer>
          {(root) => {
            store = root;
            return <></>;
          }}
        </StoreContext.Consumer>
      </StoreProvider>
    );
    expect(store).toBeDefined();
    expect(() => assertIsTreeNode(store)).not.toThrow();
    expect(isRoot(store!)).toBeTruthy();
  });

  it('should clean up the store sync when the component is unmounted', async () => {
    const cleanup = vi.fn();
    (startStoreSync as Mock).mockImplementation(async () => {
      return cleanup;
    });

    const { unmount } = render(
      <StoreProvider>
        <></>
      </StoreProvider>
    );
    // need to wait for effect to run
    await nextTick();
    unmount();
    expect(cleanup).toHaveBeenCalledWith();
  });
});
