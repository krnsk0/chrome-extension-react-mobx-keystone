/* eslint-disable @typescript-eslint/no-explicit-any */

let dataStore: any = {};
let storageListeners: any[] = [];
let runtimeMessageListeners: any[] = [];
let tabId = '';

export const chromeDebug = {
  /**
   * Clear internal state of the chrome mock
   */
  resetMockChrome: () => {
    dataStore = {};
    storageListeners = [];
    runtimeMessageListeners = [];
    tabId = '';
  },
  /**
   * Get internal state of mock chrome for debugging
   */
  getInternals: () => {
    return { dataStore, storageListeners, runtimeMessageListeners };
  },
  /**
   * Set the tab ID returned in messages
   */
  setTabId: (newTabId: any) => {
    tabId = newTabId;
  },
};

/**
 * A functional mock of the chrome API for testing purposes
 */
export const mockChrome = {
  storage: {
    local: {
      get: (keys: string) => {
        const result = { [keys]: dataStore[keys] };
        return result;
      },
      set: (data: Record<string, any>) => {
        dataStore = { ...dataStore, ...data };
        storageListeners.forEach((listener) => {
          listener(dataStore);
        });
      },
    },
    onChanged: {
      addListener: (
        listener: (changes: Record<string, any>, areaName: string) => void
      ) => {
        storageListeners.push(listener);
      },

      removeListener: (
        listener: (changes: Record<string, any>, areaName: string) => void
      ) => {
        const index = storageListeners.indexOf(listener);
        if (index !== -1) {
          storageListeners.splice(index, 1);
        }
      },
    },
  },
  runtime: {
    sendMessage: (
      message: any,
      callback: (response: any) => void | undefined
    ) => {
      runtimeMessageListeners.forEach((listener) => {
        listener(message, { tab: { id: tabId } }, callback);
      });
    },
    onMessage: {
      addListener: (listener: any) => {
        runtimeMessageListeners.push(listener);
      },
    },
  },
};
