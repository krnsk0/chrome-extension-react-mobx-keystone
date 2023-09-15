import { applySnapshot, onSnapshot } from 'mobx-keystone';
import { Root } from './store/root';

const writeStorage = async (newState: unknown) => {
  return chrome.storage.local.set({ state: newState });
};

const readStorage = async <T>(): Promise<T> => {
  return chrome.storage.local.get(['key']) as unknown as T;
};

/**
 * Syncs keystone store with chrome storage
 */
export const startStoreSync = (root: Root) => {
  // store -> storage
  const disposer = onSnapshot(root, (snapshot) => {
    writeStorage(snapshot)
  });

  // storage -> store
  const storageChangeHandler = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    const snapshot = changes.state.newValue;
    applySnapshot(root, snapshot);
  };
  chrome.storage.onChanged.addListener(storageChangeHandler);

  // cleanup sync
  return () => {
    disposer();
    chrome.storage.onChanged.removeListener(storageChangeHandler);
  };
};
