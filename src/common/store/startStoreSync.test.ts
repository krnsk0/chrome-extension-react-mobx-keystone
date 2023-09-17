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
    const root = new TestRoot({});
    await startStoreSync(root);
    expect(root.testProp).toEqual('default_state');
  });

  it('should load a snapshot from storage and apply it', async () => {
    chrome.storage.local.set({
      __mobx_keystone_snapshot: {
        testProp: 'loaded_from_storage',
        $modelType: 'testRoot',
      },
    });
    const root = new TestRoot({});
    await startStoreSync(root);
    expect(root.testProp).toEqual('loaded_from_storage');
  });

  it('should gracefully handle an invalid snapshot, skipping any application', async () => {
    chrome.storage.local.set({
      __mobx_keystone_snapshot: {
        testProp: 'loaded_from_storage',
        $modelType: 'notRealModel',
      },
    });
    const root = new TestRoot({});
    await startStoreSync(root);
    expect(root.testProp).toEqual('default_state');
  });

  it('should, when snapshot is missing, create one and save it', async () => {
    chrome.storage.local.set({
      __mobx_keystone_snapshot: undefined,
    });
    const root = new TestRoot({});
    await startStoreSync(root);
    expect(chrome.storage.local.get(['__mobx_keystone_snapshot'])).toEqual({
      __mobx_keystone_snapshot: {
        testProp: 'default_state',
        $modelType: 'testRoot',
      },
    });
  });

  it('should sync keystone store changes back to the chrome store', async () => {
    const root = new TestRoot({});
    await startStoreSync(root);
    root.setTestProp('new_value_from_keystone');
    expect(chrome.storage.local.get(['__mobx_keystone_snapshot'])).toEqual({
      __mobx_keystone_snapshot: {
        testProp: 'new_value_from_keystone',
        $modelType: 'testRoot',
      },
    });
  });

  it('should sync chrome store changes back to the keystone store', async () => {
    const root = new TestRoot({});
    await startStoreSync(root);
    chrome.storage.local.set({
      __mobx_keystone_snapshot: {
        newValue: {
          testProp: 'new_value_from_chrome_storage',
          $modelType: 'testRoot',
        },
      },
    });
    expect(root.testProp).toEqual('new_value_from_chrome_storage');
  });

  it('should return a disposer function which, when called, tears down the two-way sync', async () => {
    const root = new TestRoot({});
    const disposer = await startStoreSync(root);
    disposer();

    // updates to store should not be reflected in storage
    root.setTestProp('new_value_from_keystone');
    expect(chrome.storage.local.get(['__mobx_keystone_snapshot'])).toEqual({
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
    expect(root.testProp).toEqual('new_value_from_keystone');
  });
});
