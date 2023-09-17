import { vi } from 'vitest';

/**
 * A partial mock of the chrome API for testing purposes
 */
export const mockChrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
    onChanged: {
      addListener: vi.fn(),
    },
    removeListener: {
      addListener: vi.fn(),
    },
  },
};
