import React, { useEffect } from 'react';

import { createStore } from './createRootStore';
import { Root } from './models/root';
import { startStoreSync } from './startStoreSync';

const store = createStore();

export const StoreContext = React.createContext<Root>(store);

const useSyncStore = (store: Root) => {
  useEffect(() => {
    let cleanup: Awaited<ReturnType<typeof startStoreSync>> | undefined =
      undefined;
    (async () => {
      cleanup = await startStoreSync(store);
      store.markLoadComplete();
    })();
    return () => {
      cleanup?.();
    };
  }, [store]);
};

const StoreProvider = ({ children }: React.PropsWithChildren) => {
  useSyncStore(store);
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default StoreProvider;
