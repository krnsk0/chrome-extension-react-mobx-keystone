import { isObject } from './isObject';

const TAB_ID_QUERY_MESSAGE = 'TAB_ID_QUERY_MESSAGE';

/**
 * Query tab id. Intended to be called in content script.
 */
export const queryTabId = async () => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { text: TAB_ID_QUERY_MESSAGE },
      (tabInfo: unknown) => {
        if (
          isObject(tabInfo) &&
          'tab' in tabInfo &&
          typeof tabInfo.tab === 'number'
        ) {
          resolve(tabInfo.tab);
        } else {
          reject(new Error('bad tabID response'));
        }
      }
    );
  });
};

/**
 * Intended to be called in service worker
 */
export const replyWithTabId = () => {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.text == TAB_ID_QUERY_MESSAGE) {
      sendResponse({ tab: sender.tab?.id });
    }
  });
};
