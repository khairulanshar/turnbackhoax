chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    sendResponse({data:document.head.innerHTML});
  }
  if ((msg.from === 'popup') && (msg.subject === 'submit')) {
    sendResponse({data:document.all[0].innerHTML});
  }
});
