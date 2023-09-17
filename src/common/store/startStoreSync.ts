import { AnyModel, applySnapshot, onSnapshot } from 'mobx-keystone';

import { isObject } from '../utils/isObject';
import { Logger, makeLogger } from '../utils/makeLogger';

const MOBX_KEYSTONE_KEY = '__mobx_keystone_snapshot';

const logger = makeLogger('storage');

/**
 * Helper to write to chrome storage at MOBX_KEYSTONE_KEY
 */
const writeStorage = async (newState: unknown) => {
  return chrome.storage.local.set({ [MOBX_KEYSTONE_KEY]: newState });
};

/**
 * Helper to read from chome storage at MOBX_KEYSTONE_KEY
 */
const readStorage = async (): Promise<unknown> => {
  const storageValue = (await chrome.storage.local.get([
    MOBX_KEYSTONE_KEY,
  ])) as unknown;
  if (isObject(storageValue) && MOBX_KEYSTONE_KEY in storageValue) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newRoot = (storageValue as any)[MOBX_KEYSTONE_KEY];
    return newRoot;
  } else {
    logger
      .fork('readStorage')
      .log('no MOBX_KEYSTONE_KEY in storage, returning empty object');
    return {};
  }
};

/**
 * Helper to apply a snapshot to a model, logging any errors
 */
const safeApplySnapshot = (
  root: AnyModel,
  snapshot: unknown,
  logger: Logger
) => {
  const childLogger = logger.fork('safeApplySnapshot');
  try {
    applySnapshot(root, snapshot);
    childLogger.log('snapshot applied', snapshot);
  } catch (error: unknown) {
    childLogger.error('snapshot application failed', snapshot);
  }
};

/**
 * Syncs the store with chrome storage. Will fetch from storage on startup and
 * resync immediately before setting up two-way subscriptions
 */
export const startStoreSync = async (root: AnyModel): Promise<() => void> => {
  const childLogger = logger.fork('startStoreSync');

  /**
   * Fetch initial state from store
   */
  childLogger.log('starting sync');
  const initialValue = await readStorage();
  safeApplySnapshot(root, initialValue, childLogger);

  /**
   * Set up syncing keystone store back to chrome storage
   */
  const disposer = onSnapshot(root, (snapshot) => {
    childLogger.fork('startStoreSync').log('keystone -> storage', snapshot);
    writeStorage(snapshot);
  });

  /**
   * Set up chrome storage to keystone store
   */
  const handleStorageUpdate = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    const newSnapshot = changes[MOBX_KEYSTONE_KEY].newValue;
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
