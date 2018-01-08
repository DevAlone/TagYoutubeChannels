import { Channel } from './channel';


export class Parser {
	getChannels(pageDom): Channel[] {
		var channels: Channel[] = [];

		for (var element of this.getSidebarElements(pageDom)) {
			if (element) {
				var channelInfo = this.getChannelInfo(element);
				if (channelInfo) 
					channels.push(channelInfo);
			}
		}

		return channels;
	}

	getSidebarElements(pageDom): any {
		var sidebarChannels = pageDom.querySelectorAll('#guide-channels a');
		if (!sidebarChannels || !sidebarChannels.length)
            sidebarChannels = document.querySelectorAll('ytd-guide-section-renderer #items ytd-guide-entry-renderer a');

        return sidebarChannels;
	}

	getChannelInfo(domElement): Channel {
		var result: Channel = new Channel();
		result.inSubscriptions = true;
    
    	try {
	        var aElement = domElement;
	        var idMatches = aElement.href.match(/\/channel\/([a-zA-Z0-9_\-\.]+)$/);

	        if (!idMatches) {
	            throw "Bad link: " + aElement.href;
	        }
	        
	        result.id = idMatches[1];
	        result.title = aElement.title || aElement.querySelector('.title').textContent;
	        var iconElement = aElement.querySelector('img') || aElement.querySelector('img');

	        if (iconElement.getAttribute("data-thumb")) 
	            result.iconUrl = iconElement.getAttribute("data-thumb");
	        else
	            result.iconUrl = iconElement.src;

	        if (!result.iconUrl || result.iconUrl.endsWith('yts/img/pixel-vfl3z5WfW.gif'))
	            result.iconUrl = "";

	        try {
	            result.newVideosCount = 
	                parseInt(aElement.querySelector('.guide-count-value').textContent 
	                            || aElement.querySelector('.guide-entry-count').textContent);
	            
	            if (!result.newVideosCount || isNaN(result.newVideosCount))
	                result.newVideosCount = 0;
	        } catch (e) {
	            result.newVideosCount = 0;
	        }
	    } catch (e) {
	        console.log(e);
	        return undefined;
	    }
	    
	    return result;
	}
}