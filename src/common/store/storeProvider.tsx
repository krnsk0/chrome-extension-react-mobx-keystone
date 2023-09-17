import React, { useEffect } from 'react';
import { createRootStore } from './createRootStore';
import { Root } from './root';
import { startStoreSync } from './startStoreSync';

const root = createRootStore();

export const StoreContext = React.createContext<Root>(root);

const useSyncStore = (root: Root) => {
  useEffect(() => {
    let cleanup: Awaited<ReturnType<typeof startStoreSync>> | undefined =
      undefined;
    (async () => {
      cleanup = await startStoreSync(root);
    })();
    return () => {
      cleanup?.();
    };
  }, [root]);
};

const StoreProvider = ({
  children,
}: React.PropsWithChildren<Record<string, unknown>>) => {
  useSyncStore(root);
  return <StoreContext.Provider value={root}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
