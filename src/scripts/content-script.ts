import { activate } from "./activate";

console.log('CONTENT SCRIPT ACTIVE');

chrome.runtime.onMessage.addListener(function (request, sender) {
  // this is a message from popup
  if (!sender.tab) {
    if (request.message === 'activate') {
      activate()
    }
  }
});
