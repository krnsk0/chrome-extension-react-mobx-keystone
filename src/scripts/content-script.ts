import { CompressorStates, Root } from '../common/store/root';
import { reaction } from 'mobx';
import { assertUnreachable } from '../common/utils/assertUnreachable';
import { startStoreSync } from '../common/storage';
import { createLogger } from '../common/utils/debugLogger';

const logger = createLogger('content-script');
logger.log('starting')

const root = new Root({});

(async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any)._keystone_root = root;

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
