// It's not used

function log(str) {
    console.log("TagYoutubeChannels: " + str.toString());
}

function getChannelsFromStorage() {
    return new Promise((resolve, reject) => {
        var channels = {};
        function processResult(storage) {
            for (var key in storage) {
                if (key.startsWith("channel_"))
                    channels[key.substr(8)] = storage[key];
            }
            resolve(channels);
        }

        if (typeof browser !== 'undefined') {
            browser.storage.sync.get(null).then(
                storage => processResult(storage), 
                error => reject(error)
            );
        } else {
            chrome.storage.sync.get(null, (storage) => {
                if (chrome && chrome.runtime.error) {
                    reject(chrome.runtime.error);
                    return;
                }

                processResult(storage);
            });
        }
    });
}

function updateChannelInStorage(myChannel, subscriptions) {
    if (typeof browser !== 'undefined') {
        browser.storage.sync.set({
            myLastChannel: myChannel
        });
    } else {
        chrome.storage.sync.set({
            myLastChannel: myChannel
        });
    }

    getChannelsFromStorage().then((channels) => {
        console.log(channels);

        for (var channelId in channels)
            channels[channelId].inSubscriptions = false;

        for (var id in subscriptions) {
            var subscription = subscriptions[id];

            if (!channels[id]) {
                channels[id] = {
                    title: subscription.title || "",
                    iconUrl: subscription.iconUrl || "",
                    newVideosCount: subscription.newVideosCount || 0,
                    inSubscriptions: true,
                    note: ""
                }; 
            } else {
                var channel = channels[id];

                if (subscription.title)
                    channel.title = subscription.title;
                if (typeof subscription.iconUrl === 'string' && subscription.iconUrl.length > 0)
                    channel.iconUrl = subscription.iconUrl;
                if (subscription.newVideosCount)
                    channel.newVideosCount = subscription.newVideosCount;
                channel.inSubscriptions = true;
            }
        }

        var objToSave = {};


        for (var channelId in channels) {
            var channel = channels[channelId];
            objToSave["channel_" + channelId] = channel;
        }

        console.log(objToSave);

        if (typeof browser !== 'undefined') {
            browser.storage.sync.set(objToSave);
        } else {
            chrome.storage.sync.set(objToSave);
        }
    });
}

function getChannelInfo(channelSidebarElement) {
    var result = {};
    
    try {
        var aElement = channelSidebarElement;
        var idMatches = aElement.href.match(/\/channel\/([a-zA-Z0-9_\-\.]+)$/);

        if (!idMatches) {
            throw "Bad link: " + aElement.href;
        }
        
        result.id = idMatches[1];
        result.title = aElement.title || aElement.querySelector('.title').textContent;
        var iconElement = aElement.querySelector('.thumb .yt-thumb-clip img') || aElement.querySelector('img');

        if (iconElement["data-thumb"] !== undefined) 
            result.iconUrl = iconElement["data-thumb"];
        else
            result.iconUrl = iconElement.src;

        if (result.iconUrl === undefined || result.iconUrl == "https://www.youtube.com/yts/img/pixel-vfl3z5WfW.gif")
            result.iconUrl = "";

        try {
            result.newVideosCount = 
                parseInt(aElement.querySelector('.guide-count-value').textContent 
                            || aElement.querySelector('.guide-entry-count').textContent);
            
            if (!result.newVideosCount || result.newVideosCount == "")
                result.newVideosCount = 0;
        } catch (e) {
            result.newVideosCount = 0;
        }
        
    } catch (e) {
        log(e);
        return undefined;
    }
    
    return result;
}

function process() {
    try {
        log("processing...");
        var myChannelId = "";
        
        try {
            var myChannelUrl = document.querySelector('#guide-container .personal-item a[title="My channel"]').href;
            var matches = myChannelUrl.match(/\/channel\/([a-zA-Z0-9_\-\.]+)(\?.+)?$/);
            myChannelId = matches[1];
        } catch(e) {
            try {
                var myChannelUrl = document.querySelector('ytd-active-account-header-renderer a').href;
                var matches = myChannelUrl.match(/\/channel\/([a-zA-Z0-9_\-\.]+)(\?.+)?$/);
                myChannelId = matches[1];
            } catch (e) {
                try {
                    var myChannelUrl = Array.from(document.querySelectorAll('#guide ytd-guide-section-renderer h3 a')).find(item => item.textContent.toLowerCase() == 'library').href;
                    var matches = myChannelUrl.match(/\/channel\/([a-zA-Z0-9_\-\.]+)\/playlists$/);
                    myChannelId = matches[1];
                } catch (e) {
                    console.log('unable to determine current channel');
                    console.log(e);    
                    throw e;
                }
            }
        }

        var myChannel = {
            id: myChannelId
        }
        
        var sidebarChannels = document.querySelectorAll('#guide-channels a');
        if (!sidebarChannels || !sidebarChannels.length)
            sidebarChannels = document.querySelectorAll('ytd-guide-section-renderer #items ytd-guide-entry-renderer a');

        channels = {}
        for (var element of sidebarChannels) {
            var channelInfo = getChannelInfo(element);

            if (channelInfo !== undefined) {
                channels[channelInfo.id] = {
                    title: channelInfo.title,
                    iconUrl: channelInfo.iconUrl,
                    newVideosCount: channelInfo.newVideosCount
                };
            }
        }
        
        updateChannelInStorage(myChannel, channels);
    } catch (e) {
        log(e);
    }
    
    setTimeout(process, 15000);
}


log("loaded");

process();