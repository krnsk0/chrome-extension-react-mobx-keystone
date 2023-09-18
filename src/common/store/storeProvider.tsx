import React, { useEffect } from 'react';

import { createStore } from './createRootStore';
import { Root } from './models/root';
import { startStoreSync } from './startStoreSync';

const root = createStore();

export const StoreContext = React.createContext<Root>(root);

const useSyncStore = (root: Root) => {
  useEffect(() => {
    let cleanup: Awaited<ReturnType<typeof startStoreSync>> | undefined =
      undefined;
    (async () => {
      cleanup = await startStoreSync(root);
      root.markLoadComplete();
    })();
    return () => {
      cleanup?.();
    };
  }, [root]);
};

const StoreProvider = ({ children }: React.PropsWithChildren) => {
  useSyncStore(root);
  return <StoreContext.Provider value={root}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
