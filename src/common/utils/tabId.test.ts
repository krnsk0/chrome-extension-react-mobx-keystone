import { describe, expect, it } from 'vitest';

import { chromeDebug } from '../../../testing/mockChrome';
import { queryTabId, replyWithTabId } from './tabId';

describe('the queryTabId function and replyWithTabId functions together', () => {
  it('should allow service worker to send tab ID to content script', async () => {
    chromeDebug.setTabId(123);
    replyWithTabId();
    expect(await queryTabId()).toBe(123);
  });

  it('should throw in the content script when receiving a bad value', async () => {
    chromeDebug.setTabId({ foo: 'bar' });
    replyWithTabId();
    await expect(queryTabId).rejects.toEqual(new Error('bad tabID response'));
  });
});
