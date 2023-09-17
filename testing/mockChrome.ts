/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi } from 'vitest';

/**
 * A functional mock of the chrome API for testing purposes. All functions
 * are spied for inspection
 */
export const makeMockChrome = () => {
  let dataStore: any = {};
  let listeners: any[] = [];

  return {
    storage: {
      local: {
        get: vi.fn().mockImplementation((keys: string) => {
          const result = { [keys]: dataStore[keys] };
          return result;
        }),
        set: vi.fn().mockImplementation((data: Record<string, any>) => {
          dataStore = { ...dataStore, ...data };
        }),
      },
      onChanged: {
        addListener: vi
          .fn()
          .mockImplementation(
            (
              listener: (changes: Record<string, any>, areaName: string) => void
            ) => {
              listeners.push(listener);
            }
          ),

        removeListener: vi
          .fn()
          .mockImplementation(
            (
              listener: (changes: Record<string, any>, areaName: string) => void
            ) => {
              const index = listeners.indexOf(listener);
              if (index !== -1) {
                listeners.splice(index, 1);
              }
            }
          ),
      },
    },

    reset: function () {
      dataStore = {};
      listeners = [];
    },
  };
};
