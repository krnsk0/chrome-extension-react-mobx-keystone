import {
  fromSnapshot,
  ModelAutoTypeCheckingMode,
  registerRootStore,
  setGlobalConfig,
  SnapshotInOf,
} from 'mobx-keystone';

import { Root } from './models/root';

/**
 * Create new mobx keystone store, expose it to the window for development
 *
 * Allows injecting a snapshot for testing
 */
export function createStore(snapshot?: SnapshotInOf<Root>) {
  setGlobalConfig({
    modelAutoTypeChecking: ModelAutoTypeCheckingMode.AlwaysOn,
    showDuplicateModelNameWarnings: true,
  });
  const store = snapshot ? fromSnapshot<Root>(snapshot) : new Root({});
  registerRootStore(store);

  if (import.meta.env.DEV) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)._keystone_store = store;
  }

  return store;
}
