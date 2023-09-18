/* eslint-disable react-refresh/only-export-components */
import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';

import StoreProvider from '../src/common/store/storeProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <StoreProvider>{children}</StoreProvider>;
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {}

export const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  return render(ui, { wrapper: Providers, ...options });
};
