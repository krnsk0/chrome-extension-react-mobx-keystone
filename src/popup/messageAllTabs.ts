export const messageAllTabs = async (message: unknown) => {
  const tabs = await chrome.tabs.query({});
  return Promise.all(tabs.map(tab => chrome.tabs.sendMessage(tab.id!, message)))
}
