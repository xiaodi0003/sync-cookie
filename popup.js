(function() {
  const bg = chrome.extension.getBackgroundPage();
  const fromSelect = document.getElementById('from-select');
  const toSelect = document.getElementById('to-select');
  const cookieSelect = document.getElementById('cookie-select');
  
  chrome.tabs.query({}, tabs => {
    const urls = tabs.map(tab => tab.url.replace(/(?<!\/|:)\/.*$/, '/'));
    const urlOptions = urls.map(url => `<option value='${url}'>${url}</option>`);
    fromSelect.innerHTML = urlOptions;
    toSelect.innerHTML = urlOptions;
  
    chrome.storage.sync.get(['from', 'to', 'cookie'], function(items) {
      items.from && (fromSelect.value = items.from);
      items.to && (toSelect.value = items.to);
      
      onChangeFrom().then(() => {
        items.cookie && (cookieSelect.value = items.cookie);
      });
    });
    
    fromSelect.onchange = onChangeFrom;
    document.getElementById('save').onclick = save;
  });
  
  function onChangeFrom() {
    return new Promise(resolve => {
      bg.getCookies({url: fromSelect.value}, function(cookies) {
        const cookieOptions = cookies.map(cookie => `<option value='${cookie.name}'>${cookie.name}</option>`);
        cookieSelect.innerHTML = cookieOptions;
        resolve();
      });
    });
  }

  function saveConfig() {
    chrome.storage.sync.set({
      from: fromSelect.value,
      to: toSelect.value,
      cookie: cookieSelect.value
    });
  }

  function syncCookie() {
    chrome.storage.sync.get(['from', 'to', 'cookie'], function(items) {
      bg.syncCookie({
        from: {
          url: items.from,
          name: items.cookie
        },
        to: {
          url: items.to,
          name: items.cookie,
          path: '/'
        }
      }, null, function(response) {
        console.log('setCookie:', response);
      });
    });
  }
  
  function save() {
    saveConfig();
    syncCookie();
    window.close();
  }
})();
