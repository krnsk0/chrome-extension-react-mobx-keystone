import { applySnapshot, getSnapshot, onSnapshot } from 'mobx-keystone';
import { Root } from './store/root';
import { isObject } from './utils/isObject';

const ROOT_KEY = 'ROOT_KEY';



const writeStorage = async (newState: unknown) => {
  return chrome.storage.local.set({ [ROOT_KEY]: newState });
};

const readStorage = async (): Promise<unknown> => {
  const storageValue = (await chrome.storage.local.get([ROOT_KEY])) as unknown;
  if (isObject(storageValue) && ROOT_KEY in storageValue) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newRoot = (storageValue as any)[ROOT_KEY];
    return newRoot;
  } else {
    logger('readStorage::no ROOT_KEY in storage, returning empty object');
    return {};
  }
};

export const startStoreSync = async (root: Root): Promise<() => void> => {
  logger('startStoreSync');
  const initialValue = await readStorage();
  applySnapshot(root, initialValue as Root);
  logger('startStoreSync::store after initialization', getSnapshot(root));

  const disposer = onSnapshot(root, (snapshot) => {
    logger('startStoreSync::keystore -> storage', snapshot);
    writeStorage(snapshot);
  });

  const handleStorageUpdate = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    const newSnapshot = changes[ROOT_KEY].newValue;
    logger('startStoreSync::handleStorageUpdate', newSnapshot);
    applySnapshot(root, newSnapshot);
  };
  chrome.storage.onChanged.addListener(handleStorageUpdate);

  return () => {
    disposer();
    chrome.storage.onChanged.removeListener(handleStorageUpdate);
  };
};
