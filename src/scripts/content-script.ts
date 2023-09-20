// import { reaction } from 'mobx';

import { createStore } from '../common/store/createRootStore';
import { startStoreSync } from '../common/store/startStoreSync';
import { makeLogger } from '../common/utils/makeLogger';
import { queryTabId } from '../common/utils/tabId';

const logger = makeLogger('content-script');
logger.log('starting content script');

(async () => {
  const store = createStore();
  await startStoreSync(store);
  store.markLoadComplete();
  const tabId = await queryTabId();

  // can use reaction to subscribe to store changes here
})();
