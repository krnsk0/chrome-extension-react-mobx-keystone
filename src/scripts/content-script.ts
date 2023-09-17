import { CompressorStates } from '../common/store/root';
import { reaction } from 'mobx';
import { assertUnreachable } from '../common/utils/assertUnreachable';
import { startStoreSync } from '../common/store/startStoreSync';
import { makeLogger } from '../common/utils/makeLogger';
import { createRootStore } from '../common/store/createRootStore';

const logger = makeLogger('content-script');
logger.log('starting')

const root = createRootStore();

(async () => {
  await startStoreSync(root);

  const reactionLogger = logger.fork('reaction');
  reaction(
    () => root.compressorState,
    (compressorState) => {
      switch (compressorState) {
        case CompressorStates.DISABLED:
          reactionLogger.log('disabling compressor');
          break;
        case CompressorStates.ENABLING:
          reactionLogger.log('enabling compressor')
          setTimeout(() => {
            root.compressorActivated();
          }, 2000);
          break;
        case CompressorStates.ACTIVE:
          reactionLogger.log('compressor activated');
          break;
        case CompressorStates.FAILED:
          reactionLogger.log('compressor failed')
          break;
        default:
          assertUnreachable(compressorState);
      }
    },
    { fireImmediately: true }
  );
})();
