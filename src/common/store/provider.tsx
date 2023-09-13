import {
  ModelAutoTypeCheckingMode,
  applySnapshot,
  onSnapshot,
  registerRootStore,
  setGlobalConfig,
} from 'mobx-keystone';
import React, { useEffect } from 'react';
import { Root } from './root';
import { writeStorage } from '../storage';

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
    const disposer = onSnapshot(root, (snapshot) => {
      writeStorage(snapshot).then(() => {
        console.log('snapshot saved')
      })
    })

    const storageChangeHandler = (changes: { [key: string]: chrome.storage.StorageChange; }) => {
      const snapshot = changes.state.newValue
      applySnapshot(root, snapshot)
    }

    chrome.storage.onChanged.addListener(storageChangeHandler)

    return () => {
      disposer()
      chrome.storage.onChanged.removeListener(storageChangeHandler)
    }
  }, [])




  return <StoreContext.Provider value={root}>{children}</StoreContext.Provider>;
};
