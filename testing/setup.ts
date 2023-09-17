import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

import { mockChrome, resetMockChrome } from './mockChrome';

// stub the chrome API globally as it is not
// part of JSDOM
vi.stubGlobal('chrome', mockChrome);

beforeEach(() => {
  vi.resetAllMocks();
  resetMockChrome();
});

afterEach(() => {
  cleanup();
});
