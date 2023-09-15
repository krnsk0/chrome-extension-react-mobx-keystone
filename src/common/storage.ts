import { applySnapshot, getSnapshot, onSnapshot } from 'mobx-keystone';
import { Root } from './store/root';
import { isObject } from './utils/isObject';

const ROOT_KEY = 'ROOT_KEY'

const writeStorage = async (newState: unknown) => {
  return chrome.storage.local.set({ [ROOT_KEY]: newState });
};

const readStorage = async (): Promise<unknown> => {
  const storageValue = chrome.storage.local.get([ROOT_KEY]) as unknown;
  if (isObject(storageValue) && ROOT_KEY in storageValue) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (storageValue as any).root
  } else return {}
};




/**
 * Syncs keystone store with chrome storage
 */
export const startStoreSync = async (root: Root): Promise<() => void> => {
  // storage -> store
  const storageChangeHandler = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    const snapshot = changes[ROOT_KEY].newValue;
    console.log('change handler: ', snapshot);

    applySnapshot(root, snapshot);
  };
  chrome.storage.onChanged.addListener(storageChangeHandler);

  return new Promise((resolve) => {
    readStorage().then((snapshot) => {
      console.log('applying snapshot: ', snapshot);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        applySnapshot(root, snapshot as any);
      console.log('root: ', getSnapshot(root));


      // store -> storage
      const disposer = onSnapshot(root, (snapshot) => {
        writeStorage(snapshot);
      });

      // sync back
      writeStorage(snapshot);

      // disposer
      const cleanup = () => {
        disposer();
        chrome.storage.onChanged.removeListener(storageChangeHandler);
      };

      resolve(cleanup);
    });
  });
};
