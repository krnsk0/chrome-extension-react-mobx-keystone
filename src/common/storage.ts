import { State } from "./state";

export const updateState = async (newState: State) => {
  return chrome.storage.local.set({ state: newState })
}

export const getState = async (): Promise<State> => {
  return chrome.storage.local.get(["key"]) as unknown as State
}
