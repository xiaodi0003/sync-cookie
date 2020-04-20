(function() {
	setCookie();
})();

function setCookie() {
	chrome.storage.sync.get(['from', 'to', 'cookie'], function(items) {
		if (items.from && items.to && items.cookie) {
			const url = location.href.replace(/(?<!\/|:)\/.*$/, '/');
			if (url === items.from || url === items.to) {
				chrome.runtime.sendMessage({
					type: 'syncCookie',
					payload: {
						from: {
							url: items.from,
							name: items.cookie
						},
						to: {
							url: items.to,
							name: items.cookie,
							path: '/'
						}
					}
				}, function(response) {
					console.log('setCookie:', response);
				});
			}
		}
	});
}
