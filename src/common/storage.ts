
export const updateState = async (newState: unknown) => {
  return chrome.storage.local.set({ state: newState })
}

export const getState = async <T>(): Promise<T> => {
  return chrome.storage.local.get(["key"]) as unknown as T
}
