// import { reaction } from 'mobx';

import { createStore } from '../common/store/createRootStore';
import { startStoreSync } from '../common/store/startStoreSync';
import { makeLogger } from '../common/utils/makeLogger';

const logger = makeLogger('content-script');
logger.log('starting content script');

(async () => {
  const store = createStore();
  await startStoreSync(store);
  store.markLoadComplete();

  // can use reaction to subscribe to store changes here
})();
