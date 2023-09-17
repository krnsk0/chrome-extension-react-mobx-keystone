import { computed } from 'mobx';
import { model, Model, modelAction, tProp, types } from 'mobx-keystone';
import { assertUnreachable } from '../utils/assertUnreachable';

export enum CompressorStates {
  DISABLED = 'DISABLED',
  ENABLING = 'ENABLING',
  ACTIVE = 'ACTIVE',
  FAILED = 'FAILED',
}

@model('Root')
export class Root extends Model({
  compressorState: tProp(
    types.enum(CompressorStates),
    CompressorStates.DISABLED
  ),
}) {
  @computed
  get displayableState(): string {
    switch (this.compressorState) {
      case CompressorStates.DISABLED:
        return 'Disabled';
      case CompressorStates.ENABLING:
        return 'Enabling';
      case CompressorStates.ACTIVE:
        return 'Active';
      case CompressorStates.FAILED:
        return 'Failed';
      default:
        return assertUnreachable(this.compressorState);
    }
  }

  /**
   * Intended to be called by the UI to toggle the state of the * compressor for a tab.
   */
  @modelAction
  toggleActivation(): void {
    switch (this.compressorState) {
      case CompressorStates.DISABLED:
        this.compressorState = CompressorStates.ENABLING;
        break;
      case CompressorStates.ENABLING:
        this.compressorState = CompressorStates.DISABLED;
        break;
      case CompressorStates.ACTIVE:
        this.compressorState = CompressorStates.DISABLED;
        break;
      case CompressorStates.FAILED:
        this.compressorState = CompressorStates.DISABLED;
        break;
      default:
        assertUnreachable(this.compressorState);
    }
  }

  /**
   * To be called when the compressor successfully activates.
   */
  @modelAction
  compressorActivated(): void {
    this.compressorState = CompressorStates.ACTIVE;
  }
}
