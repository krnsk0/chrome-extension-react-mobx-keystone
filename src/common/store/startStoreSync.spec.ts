import { describe, expect, it } from 'vitest';

import { createRootStore } from './createRootStore';
import { startStoreSync } from './startStoreSync';

describe('The startStoreSync function', () => {
  it('should pass', async () => {
    const root = createRootStore();
    await startStoreSync(root);
  });
});
