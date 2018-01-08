var browser = browser || chrome;

function openMainPage() {
        browser.tabs.create({
            url: "index.html"
        });
}

browser.browserAction.onClicked.addListener(openMainPage);


function addFramePermissions(e) {
	// console.log("Loading fucking url: " + e.url);

	var xFrameOptionsFound = false;

	for (var header of e.responseHeaders) {
		if (header.name.toLowerCase() === 'x-frame-options') {
			header.value = 'ALLOW-FROM ' + browser.extension.getURL('');
			xFrameOptionsFound = true;
			break;
		}
	}

	if (!xFrameOptionsFound) {
		e.responseHeaders.push({
			name: 'x-frame-options',
			value: 'ALLOW-FROM ' + browser.extension.getURL('')
		});
	}

	return { responseHeaders: e.responseHeaders };
}


browser.webRequest.onHeadersReceived.addListener(	
	addFramePermissions,
	{
		urls: [
			"*://*.youtube.com/*",
        	"*://youtube.com/*"
		]
	},
	["blocking", "responseHeaders"]
);