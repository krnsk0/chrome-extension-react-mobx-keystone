import { CompressorStates, Root } from '../common/store/root';
import { reaction } from 'mobx';
import { assertUnreachable } from '../common/utils/assertUnreachable';
import { startStoreSync } from '../common/storage';
import { logger } from '../common/utils/debugLogger';

logger('CONTENT SCRIPT STARTED');

const root = new Root({});

(async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any)._keystone_root = root;

  await startStoreSync(root);

  reaction(
    () => root.compressorState,
    (compressorState) => {
      switch (compressorState) {
        case CompressorStates.DISABLED:
          logger('content-script::reaction::disabling compressor');
          break;
        case CompressorStates.ENABLING:
          logger('content-script::reaction::enabling compressor');
          setTimeout(() => {
            root.compressorActivated();
          }, 2000);
          break;
        case CompressorStates.ACTIVE:
          logger('content-script::reaction::compressor activated');
          break;
        case CompressorStates.FAILED:
          logger('content-script::reaction::compressor failed');
          break;
        default:
          assertUnreachable(compressorState);
      }
    },
    { fireImmediately: true }
  );
})();
