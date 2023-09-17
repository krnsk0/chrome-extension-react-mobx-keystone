/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';

let dataStore: any = {};
let listeners: any[] = [];

/**
 * Clear internal state of the chrome mock
 */
export const resetMockChrome = () => {
  dataStore = {};
  listeners = [];
};

/**
 * Get internal state of mock chrome for debugging
 */
export const debugMockChrome = () => {
  return { dataStore, listeners };
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
        listeners.forEach((listener) => {
          console.log('DEBUG 0');
          listener(dataStore);
        });
      },
    },
    onChanged: {
      addListener: (
        listener: (changes: Record<string, any>, areaName: string) => void
      ) => {
        listeners.push(listener);
      },

      removeListener: (
        listener: (changes: Record<string, any>, areaName: string) => void
      ) => {
        const index = listeners.indexOf(listener);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      },
    },
  },
};
