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
  ).withSetter(),
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



  @modelAction
  reset(): void {}
}
