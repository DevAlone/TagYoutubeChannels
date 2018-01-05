var browser = browser || chrome;

function openMainPage() {
        browser.tabs.create({
            url: "index.html"
        });
}

browser.browserAction.onClicked.addListener(openMainPage);


function addFramePermissions(e) {
	console.log("Loading fucking url: " + e.url);
	// console.log('fucking headers');
	// console.log(e);

	var allowedHeaders = [];

	for (var header of e.responseHeaders) {
		if (header.name.toLowerCase() !== "x-frame-options") {
			allowedHeaders.push(header);
		} else {
			// console.log('x-frame-options found!!!');
		}
	}

	e.responseHeaders = allowedHeaders;
	// e.responseHeaders = [];

	// console.log(e);

	return { responseHeaders: e.responseHeaders };
}


// browser.webRequest.onHeadersReceived.addListener(
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