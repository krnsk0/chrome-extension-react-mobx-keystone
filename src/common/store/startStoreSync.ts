import { applySnapshot, getSnapshot, onSnapshot } from 'mobx-keystone';
import { Root } from './root';
import { isObject } from '../utils/isObject';
import { makeLogger } from '../utils/makeLogger';

const ROOT_KEY = 'ROOT_KEY';

const logger = makeLogger('storage');

/**
 * Helper to write to chrome storage at ROOT_KEY
 */
const writeStorage = async (newState: unknown) => {
  return chrome.storage.local.set({ [ROOT_KEY]: newState });
};

/**
 * Helper to read from chome storage at ROOT_KEY
 */
const readStorage = async (): Promise<unknown> => {
  const storageValue = (await chrome.storage.local.get([ROOT_KEY])) as unknown;
  if (isObject(storageValue) && ROOT_KEY in storageValue) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newRoot = (storageValue as any)[ROOT_KEY];
    return newRoot;
  } else {
    logger
      .fork('readStorage')
      .log('no ROOT_KEY in storage, returning empty object');
    return {};
  }
};

/**
 * Syncs the store with chrome storage. Will fetch from storage on startup and
 * resync immediately before setting up two-way subscriptions
 */
export const startStoreSync = async (root: Root): Promise<() => void> => {
  const childLogger = logger.fork('startStoreSync');
  childLogger.log('starting sync');
  const initialValue = await readStorage();
  applySnapshot(root, initialValue as Root);
  childLogger.log('store after initialization', getSnapshot(root));

  const disposer = onSnapshot(root, (snapshot) => {
    childLogger.fork('startStoreSync').log('keystone -> storage', snapshot);
    writeStorage(snapshot);
  });

  const handleStorageUpdate = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    const newSnapshot = changes[ROOT_KEY].newValue;
    childLogger
      .fork('handleStorageUpdate')
      .log('storage -> keystone', newSnapshot);
    applySnapshot(root, newSnapshot);
  };
  chrome.storage.onChanged.addListener(handleStorageUpdate);

  return () => {
    disposer();
    chrome.storage.onChanged.removeListener(handleStorageUpdate);
  };
};
