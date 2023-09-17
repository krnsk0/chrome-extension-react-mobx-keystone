/* eslint-disable no-global-assign */
import { afterAll, beforeAll } from 'vitest';

export const disableConsole = () => {
  const originalConsole = { ...console };
  beforeAll(() => {
    console = {
      ...originalConsole,
      log: () => {},
      info: () => {},
      debug: () => {},
      warn: () => {},
      error: () => {},
    };
  });
  afterAll(() => {
    console = originalConsole;
  });
};
