/* eslint-disable no-global-assign */
import { afterAll, beforeAll } from 'vitest';

import { pauseLogger, resumeLogger } from '../src/common/utils/makeLogger';

export const disableLogger = () => {
  beforeAll(() => {
    pauseLogger();
  });
  afterAll(() => {
    resumeLogger();
  });
};
