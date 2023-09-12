console.log('IN CONTENT SCRIPT; ADDING LISTENER');

chrome.runtime.onMessage.addListener(function (request, sender) {
  // this is a message from popup
  if (!sender.tab) {
    console.log(request);
  }
});
