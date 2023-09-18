import { Model, model, tProp, types } from 'mobx-keystone';
import { describe, expect, it } from 'vitest';

import { disableLogger } from '../../../testing/disableLogger';
import { startStoreSync } from './startStoreSync';

// comment out to debug tests
disableLogger();

/**
 * Small fake test model useful for decoupling these tests from
 * any actual application models
 */
@model('testRoot')
class TestRoot extends Model({
  testProp: tProp(types.string, 'default_state').withSetter(),
}) {}

describe('the startStoreSync function', () => {
  it('should apply an empty object snapshot when there is nothing in storage', async () => {
    const store = new TestRoot({});
    await startStoreSync(store);
    expect(store.testProp).toBe('default_state');
  });

  it('should load a snapshot from storage and apply it', async () => {
    chrome.storage.local.set({
      __mobx_keystone_snapshot: {
        testProp: 'loaded_from_storage',
        $modelType: 'testRoot',
      },
    });
    const store = new TestRoot({});
    await startStoreSync(store);
    expect(store.testProp).toBe('loaded_from_storage');
  });

  it('should gracefully handle an invalid snapshot, skipping any application', async () => {
    chrome.storage.local.set({
      __mobx_keystone_snapshot: {
        testProp: 'loaded_from_storage',
        $modelType: 'notRealModel',
      },
    });
    const store = new TestRoot({});
    await startStoreSync(store);
    expect(store.testProp).toBe('default_state');
  });

  it('should, when snapshot is missing, create one and save it', async () => {
    chrome.storage.local.set({
      __mobx_keystone_snapshot: undefined,
    });
    const store = new TestRoot({});
    await startStoreSync(store);
    expect(
      chrome.storage.local.get(['__mobx_keystone_snapshot'])
    ).toStrictEqual({
      __mobx_keystone_snapshot: {
        testProp: 'default_state',
        $modelType: 'testRoot',
      },
    });
  });

  it('should sync keystone store changes back to the chrome store', async () => {
    const store = new TestRoot({});
    await startStoreSync(store);
    store.setTestProp('new_value_from_keystone');
    expect(
      chrome.storage.local.get(['__mobx_keystone_snapshot'])
    ).toStrictEqual({
      __mobx_keystone_snapshot: {
        testProp: 'new_value_from_keystone',
        $modelType: 'testRoot',
      },
    });
  });

  it('should sync chrome store changes back to the keystone store', async () => {
    const store = new TestRoot({});
    await startStoreSync(store);
    chrome.storage.local.set({
      __mobx_keystone_snapshot: {
        newValue: {
          testProp: 'new_value_from_chrome_storage',
          $modelType: 'testRoot',
        },
      },
    });
    expect(store.testProp).toBe('new_value_from_chrome_storage');
  });

  it('should return a disposer function which, when called, tears down the two-way sync', async () => {
    const store = new TestRoot({});
    const disposer = await startStoreSync(store);
    disposer();

    // updates to store should not be reflected in storage
    store.setTestProp('new_value_from_keystone');
    expect(
      chrome.storage.local.get(['__mobx_keystone_snapshot'])
    ).toStrictEqual({
      __mobx_keystone_snapshot: {
        testProp: 'default_state',
        $modelType: 'testRoot',
      },
    });

    // updates to storage should not be reflected in store
    chrome.storage.local.set({
      __mobx_keystone_snapshot: {
        newValue: {
          testProp: 'new_value_from_chrome_storage',
          $modelType: 'testRoot',
        },
      },
    });
    expect(store.testProp).toBe('new_value_from_keystone');
  });
});
