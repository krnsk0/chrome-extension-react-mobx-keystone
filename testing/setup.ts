import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

import { mockChrome } from './mockChrome';

// stub the chrome API globally as it is not
// part of JSDOM
vi.stubGlobal('chrome', mockChrome);

// clear JSDOM state after each test
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
