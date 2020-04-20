/* chrome.cookies只在background里面可以被使用，在content中不能被使用 */
chrome.runtime.onMessage.addListener(handleMessage);

function getUrls() {
  return new Promise((resolve) => {
    chrome.cookies.getAll({}, resolve);
  });
}

function getCookies(request, callback) {
  chrome.cookies.getAll(request, (cks) => {
    callback(cks);
  });
}

function handleMessage(message, sender, callback) {
  window[message.type](message.payload, sender, callback);
  /**
   * 返回true才能同步执行回调
   * https://blog.csdn.net/anjingshen/article/details/75579521
   */ 
  return true;
}

function syncCookie(request, sender, sendResponse) {
  chrome.cookies.get(request.from, (cks) => {
    const to = {
      ...request.to,
      value: cks.value
    };
    chrome.cookies.set(to, function() {
      sendResponse({from: request.from, to});
    });
  });
}

function getCurrentTab(request, sender, sendResponse) {
  chrome.tabs.getCurrent(sendResponse);
}
