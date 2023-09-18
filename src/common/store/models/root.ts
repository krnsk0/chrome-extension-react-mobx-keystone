import { action, observable } from 'mobx';
import { Model, model } from 'mobx-keystone';

@model('Root')
export class Root extends Model({}) {
  /**
   * This property intentionally not serialized
   */
  @observable
  doneLoadingFromStorage = false;

  /**
   * Indicate that finished loading from a snapshot when one exists; when
   * one does not exist, we're good to go to use the model. Intended to
   * be used to e.g. show a loading spinner
   */
  @action.bound
  markLoadedComplete() {
    this.doneLoadingFromStorage = true;
  }
}
