import { Model, model, tProp, types } from 'mobx-keystone';
import { describe, expect, it, Mock } from 'vitest';

import { startStoreSync } from './startStoreSync';
/**
 * Small fake test model useful for decoupling these tests from
 * any actual application models
 */
@model('testRoot')
class TestRoot extends Model({
  testProp: tProp(types.string, 'default_state').withSetter(),
}) {}

describe('The startStoreSync function', () => {
  it('should apply an empty object snapshot when there is nothing in storage', async () => {
    const root = new TestRoot({});
    await startStoreSync(root);
    expect(root.testProp).toEqual('default_state');
  });

  it('should load a snapshot from storage and apply it', async () => {
    (chrome.storage.local.get as Mock).mockReturnValueOnce({
      _mobx_keystone_snapshot: {
        testProp: 'loaded_from_storage',
        $modelType: 'testRoot',
      },
    });
    const root = new TestRoot({});
    await startStoreSync(root);
    expect(root.testProp).toEqual('loaded_from_storage');
  });

  it('should gracefully handle an invalid snapshot', async () => {
    (chrome.storage.local.get as Mock).mockReturnValueOnce({
      _mobx_keystone_snapshot: {
        testProp: 'loaded_from_storage',
        $modelType: 'notRealModel',
      },
    });
    const root = new TestRoot({});
    await startStoreSync(root);
    expect(root.testProp).toEqual('loaded_from_storage');
  });

  it('should sync keystone store changes back to the chrome store', () => {});

  it('should sync chrome store stages back to the keystone store', () => {});

  it('should return a disposer function which, when called, tears down the two-way sync', () => {});
});
