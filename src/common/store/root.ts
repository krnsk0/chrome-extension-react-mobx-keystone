import { model, Model, modelAction, tProp, types } from 'mobx-keystone';
import { computed } from 'mobx';

export enum CompressorStates {
  DISABLED = 'DISABLED',
  ENABLING = 'ENABLING',
  ACTIVE = 'ACTIVE',
  FAILED = 'FAILED',
}

// eslint-disable-next-line
function assertUnreachable(_x: never): never {
  throw new Error("Didn't expect to get here");
}

@model('Root')
export class Root extends Model({
  state: tProp(
    types.enum(CompressorStates),
    CompressorStates.DISABLED
  ),
}) {
  @computed
  get displayableState(): string {
    switch (this.state) {
      case CompressorStates.DISABLED:
        return 'Disabled';
      case CompressorStates.ENABLING:
        return 'Enabling';
      case CompressorStates.ACTIVE:
        return 'Active';
      case CompressorStates.FAILED:
        return 'Failed';
      default:
        return assertUnreachable(this.state);
    }
  }



  /**
   * Intended to be called by the UI to toggle the state of the * compressor for a tab.
   */
  @modelAction
  toggleActivation(): void {
    switch (this.state) {
      case CompressorStates.DISABLED:
        this.state = CompressorStates.ENABLING;
        break;
      case CompressorStates.ENABLING:
        this.state = CompressorStates.DISABLED;
        break;
      case CompressorStates.ACTIVE:
        this.state = CompressorStates.DISABLED;
        break;
      case CompressorStates.FAILED:
        this.state = CompressorStates.DISABLED;
        break;
      default:
        assertUnreachable(this.state);
    }

  }
}
