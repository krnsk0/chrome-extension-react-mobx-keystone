import {
  ModelAutoTypeCheckingMode,
  registerRootStore,
  setGlobalConfig,
} from 'mobx-keystone';
import React, { useEffect } from 'react';
import { Root } from './root';
import { startStoreSync } from '../storage';

setGlobalConfig({
  modelAutoTypeChecking: ModelAutoTypeCheckingMode.AlwaysOn,
  showDuplicateModelNameWarnings: true,
});

const root = new Root({});
registerRootStore(root);

// for easy debugging
// TODO: disable in production
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any)._keystone_root = root;

export const StoreContext = React.createContext<Root>(root);

export const StoreProvider = ({
  children,
}: React.PropsWithChildren<Record<string, unknown>>) => {
  useEffect(() => {
    return startStoreSync(root);
  }, []);

  return <StoreContext.Provider value={root}>{children}</StoreContext.Provider>;
};
