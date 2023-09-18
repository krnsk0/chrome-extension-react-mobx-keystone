import {
  AnyModel,
  applySnapshot,
  getSnapshot,
  onSnapshot,
} from 'mobx-keystone';

import { isObject } from '../utils/isObject';
import { Logger, makeLogger } from '../utils/makeLogger';

const MOBX_KEYSTONE_KEY = '__mobx_keystone_snapshot';

const logger = makeLogger('storage');

/**
 * Helper to write to chrome storage at MOBX_KEYSTONE_KEY
 */
const writeStorage = async (newState: unknown) => {
  logger.fork('writeStorage').log(newState);
  return chrome.storage.local.set({ [MOBX_KEYSTONE_KEY]: newState });
};

/**
 * Helper to read from chome storage at MOBX_KEYSTONE_KEY
 */
const readStorage = async (): Promise<unknown> => {
  const storageValue = (await chrome.storage.local.get([
    MOBX_KEYSTONE_KEY,
  ])) as unknown;
  if (
    isObject(storageValue) &&
    MOBX_KEYSTONE_KEY in storageValue &&
    isObject(storageValue[MOBX_KEYSTONE_KEY])
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (storageValue as any)[MOBX_KEYSTONE_KEY];
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
  store: AnyModel,
  snapshot: unknown,
  logger: Logger
) => {
  const childLogger = logger.fork('safeApplySnapshot');
  try {
    applySnapshot(store, snapshot);
    childLogger.log('snapshot applied', snapshot);
  } catch (error: unknown) {
    childLogger.error('snapshot application failed', snapshot);
  }
};

/**
 * Syncs the store with chrome storage. Will fetch from storage on startup and
 * resync immediately before setting up two-way subscriptions
 */
export const startStoreSync = async (store: AnyModel): Promise<() => void> => {
  const childLogger = logger.fork('startStoreSync');

  /**
   * Fetch initial state from store and write back immediately
   * The immediate writeback handles cases where no store exists
   */
  childLogger.log('starting sync');
  const initialValue = await readStorage();
  safeApplySnapshot(store, initialValue, childLogger);
  await writeStorage(getSnapshot(store));

  /**
   * Set up syncing keystone store back to chrome storage
   */
  const disposer = onSnapshot(store, (snapshot) => {
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
    safeApplySnapshot(store, newSnapshot, childLogger);
  };
  chrome.storage.onChanged.addListener(handleStorageUpdate);

  return () => {
    disposer();
    chrome.storage.onChanged.removeListener(handleStorageUpdate);
  };
};
