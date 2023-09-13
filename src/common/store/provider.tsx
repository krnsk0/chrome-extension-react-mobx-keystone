import {
  ModelAutoTypeCheckingMode,
  registerRootStore,
  setGlobalConfig,
} from 'mobx-keystone';
import React from 'react';
import { Root } from './root';

setGlobalConfig({
  modelAutoTypeChecking: ModelAutoTypeCheckingMode.AlwaysOn,
  showDuplicateModelNameWarnings: true,
});

const root = new Root({});
registerRootStore(root);

// for easy debugging
// TODO: disable in production
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).root = root;

export const StoreContext = React.createContext<Root>(root);


export const StoreProvider = ({
  children,
}: React.PropsWithChildren<Record<string, unknown>>) => {
  return <StoreContext.Provider value={root}>{children}</StoreContext.Provider>;
};
