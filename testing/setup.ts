import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

import { chromeDebug, mockChrome } from './mockChrome';

// stub the chrome API globally as it is not
// part of JSDOM
vi.stubGlobal('chrome', mockChrome);

beforeEach(() => {
  vi.resetAllMocks();
  chromeDebug.resetMockChrome();
});

afterEach(() => {
  cleanup();
});
