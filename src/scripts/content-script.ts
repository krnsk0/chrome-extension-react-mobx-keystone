// import { reaction } from 'mobx';

import { createStore } from '../common/store/createRootStore';
// import { CompressorStates } from '../common/store/models/root';
import { startStoreSync } from '../common/store/startStoreSync';
// import { assertUnreachable } from '../common/utils/assertUnreachable';
import { makeLogger } from '../common/utils/makeLogger';

const logger = makeLogger('content-script');
logger.log('starting content script');

(async () => {
  const store = createStore();
  await startStoreSync(store);
  store.markLoadComplete();

  // const reactionLogger = logger.fork('reaction');
  // reaction(
  //   () => root.compressorState,
  //   (compressorState) => {
  //     switch (compressorState) {
  //       case CompressorStates.DISABLED:
  //         reactionLogger.log('disabling compressor');
  //         break;
  //       case CompressorStates.ENABLING:
  //         reactionLogger.log('enabling compressor');
  //         setTimeout(() => {
  //           root.compressorActivated();
  //         }, 2000);
  //         break;
  //       case CompressorStates.ACTIVE:
  //         reactionLogger.log('compressor activated');
  //         break;
  //       case CompressorStates.FAILED:
  //         reactionLogger.log('compressor failed');
  //         break;
  //       default:
  //         assertUnreachable(compressorState);
  //     }
  //   },
  //   { fireImmediately: true }
  // );
})();
