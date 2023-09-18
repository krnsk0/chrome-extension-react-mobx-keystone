/* eslint-disable react-refresh/only-export-components */
import { render, RenderOptions } from '@testing-library/react';
import { SnapshotInOf } from 'mobx-keystone';
import React, { ReactElement } from 'react';

import { createStore } from '../src/common/store/createRootStore';
import { Root } from '../src/common/store/models/root';
import { StoreContext } from '../src/common/store/storeProvider';

const makeProviders =
  ({ store }: { store: Root }) =>
  ({ children }: { children: React.ReactNode }) => {
    return (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
  };

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  storeSnapshot: SnapshotInOf<Root>;
}

export const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const store = createStore(options?.storeSnapshot);
  const renderResult = render(ui, {
    wrapper: makeProviders({ store }),
    ...options,
  });
  return { ...renderResult, store };
};
