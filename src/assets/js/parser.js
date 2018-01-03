function log(str) {
    console.log("TagYoutubeChannels: " + str.toString());
}

function updateChannelInStorage(myChannel, subscriptions) {
    browser.storage.sync.set({
        myLastChannel: myChannel
    });

    browser.storage.sync.get("channels").then(function(item) {
        var channels = {};
        if (item.channels !== undefined)
            channels = item.channels;

        for (var link in channels) {
            var channel = channels[link];
            channel.inSubscriptions = false;
        }

        for (var id in subscriptions) {
            if (channels[id] === undefined) 
                channels[id] = {
                    title: "",
                    iconUrl: "",
                    newVideosCount: 0,
                    inSubscriptions: false,
                    note: ""
                };
            
            var channel = channels[id];
            var newChannel = subscriptions[id];
            channel.title = newChannel.title;
            if (newChannel.iconUrl != "")
                channel.iconUrl = newChannel.iconUrl;
            channel.newVideosCount = newChannel.newVideosCount;
            channel.inSubscriptions = true;
        }

        browser.storage.sync.set({
            channels: channels
        });
    }, function(error) {
        log(error);
    });
}

function getChannelInfo(channelSidebarElement) {
    var result = {};
    
    try {
        var aElement = channelSidebarElement.querySelector('a');
        var idMatches = aElement.href.match(/\/channel\/([a-zA-Z0-9_\-\.]+)$/);;

        if (idMatches === null)
            throw "Bad link: " + aElement.href;
        
        result.id = idMatches[1];
        result.title = aElement.title;
        var iconElement = aElement.querySelector('.thumb .yt-thumb-clip img');

        if (iconElement["data-thumb"] !== undefined) 
            result.iconUrl = iconElement["data-thumb"];
        else
            result.iconUrl = iconElement.src;

        if (result.iconUrl === undefined || result.iconUrl == "https://www.youtube.com/yts/img/pixel-vfl3z5WfW.gif")
            result.iconUrl = "";

        try {
            result.newVideosCount = 
                parseInt(aElement.querySelector('.guide-count-value').textContent);
            
            if (!result.newVideosCount || result.newVideosCount == "")
                result.newVideosCount = 0;
        } catch (e) {
            result.newVideosCount = 0;
        }
        
    } catch (e) {
        log('error');
        log(e);
    }
    
    return result;
}

function process() {
    try {
        log("processing...");
        var myChannel = {
            url: document.querySelector('#guide-container .personal-item a[title="My channel"]').href
        }
        
        var sidebarChannels = document.getElementById('guide-channels');
        channels = {}
        for (var element of document.getElementById('guide-channels').children) {
            var channelInfo = getChannelInfo(element);
            channels[channelInfo.id] = {
                title: channelInfo.title,
                iconUrl: channelInfo.iconUrl,
                newVideosCount: channelInfo.newVideosCount
            };
        }
        
        updateChannelInStorage(myChannel, channels);
    } catch (e) {
        log(e);
    }
    
    setTimeout(process, 5000);
}


log("loaded");

process();