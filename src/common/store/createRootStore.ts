import {
  ModelAutoTypeCheckingMode,
  registerRootStore,
  setGlobalConfig,
} from 'mobx-keystone';

import { Root } from './root';

/**
 * Create new mobx keystone store, expose it to the window for development
 */
export function createRootStore() {
  setGlobalConfig({
    modelAutoTypeChecking: ModelAutoTypeCheckingMode.AlwaysOn,
    showDuplicateModelNameWarnings: true,
  });
  const root = new Root({});
  registerRootStore(root);

  if (import.meta.env.DEV) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)._keystone_root = root;
  }

  return root;
}
