
import React, { useEffect } from 'react';
import { Root } from './root';
import { startStoreSync } from './startStoreSync';
import { createRootStore } from './createRootStore'

const root = createRootStore();

export const StoreContext = React.createContext<Root>(root);

export const StoreProvider = ({
  children,
}: React.PropsWithChildren<Record<string, unknown>>) => {
  useEffect(() => {
    let cleanup: () => void = () => {};
    (async () => {
      cleanup = await startStoreSync(root);
    })();
    return cleanup;
  }, []);

  return <StoreContext.Provider value={root}>{children}</StoreContext.Provider>;
};
