import { applySnapshot, onSnapshot } from "mobx-keystone";
import { CompressorStates, Root } from "../common/store/root";
import { reaction } from "mobx";
import { writeStorage } from "../common/storage";
import { assertUnreachable } from "../common/store/assertUnreachable";

console.log('CONTENT SCRIPT ACTIVE');

const root = new Root({});

// for easy debugging
// TODO: disable in production
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any)._keystone_root = root;

chrome.storage.onChanged.addListener((value) => {
  const snapshot = value.state.newValue
  applySnapshot(root, snapshot)
})


onSnapshot(root, (snapshot) => {
  writeStorage(snapshot).then(() => {
  })
})

reaction(() => root.compressorState, (compressorState) => {
  switch (compressorState) {
    case CompressorStates.DISABLED:
      console.log('disabling compressor')
      break;
    case CompressorStates.ENABLING:
      console.log('enabling compressor')
      setTimeout(() => {
        root.compressorActivated();
      }, 2000)
      break;
    case CompressorStates.ACTIVE:
      console.log('compressor is active')
      break;
    case CompressorStates.FAILED:
      console.log('compressor failed to activate')
      break;
    default:
      assertUnreachable(compressorState);
  }
})
