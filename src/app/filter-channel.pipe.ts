import { Pipe, PipeTransform } from '@angular/core';
import { Channel } from './channel';
import { ChannelFilterObject } from './channel-filter-object';

@Pipe({
  name: 'filterChannel',
  pure: false
})
export class FilterChannelPipe implements PipeTransform {

    transform(channel: Channel, filterObject: ChannelFilterObject): any {
      	if (!channel || !filterObject) {
            return channel;
        }

      	// return channels.filter(channel => this.applyFilter(channel, filterObject));
        return this.applyFilter(channel, filterObject);
    }

    applyFilter(channel: Channel, filterObject: ChannelFilterObject): boolean {
      	for (let field in filterObject) {
            if (filterObject[field]) {
                let typeOfField = typeof filterObject[field];
          			
                if (channel[field] !== undefined && typeof channel[field] === typeOfField) {
                    if (typeOfField === 'string') {
                        if (channel[field].toLowerCase().indexOf(filterObject[field].toLowerCase()) === -1)
                            return false;
                    } else if (typeOfField === 'number' || typeOfField == 'boolean') {
                        if (channel[field] !== filterObject[field])
                            return false;
                    }
                } else if (field === "searchString") {
                    var searchString = filterObject.searchString.toLowerCase();

                    var found = false;

                    if (channel.title !== undefined && channel.title.toLowerCase().indexOf(searchString) >= 0)
                        found = true;
                    else if (channel.note !== undefined && channel.note.toLowerCase().indexOf(searchString) >= 0)
                        found = true;

                    if (!found)
                        return false;
                } else if (field === "isNoted") {
                    if (!channel.isNoted())
                        return false;
                } else if (field === 'isTagged') {
                    if (!channel.isTagged())
                        return false;
                } else if (field === 'isNotTagged') {
                    if (channel.isTagged())
                        return false;
                } else if (field === '_tags') {
                    if (filterObject._tags && filterObject._tags.length) {
                        let channelTags = new Set<string>();
                            for (var tag of Array.from(channel.tags.values()))
                                channelTags.add(tag.name);

                        if (filterObject.tagsStrictMode) {
                            for (var tagName of filterObject._tags) {
                                var found = false;
                                var reverse = false;
                                if (tagName[0] === '-') {
                                    reverse = true;
                                    tagName = tagName.substr(1);
                                }
                                var found = channelTags.has(tagName);
                                if (reverse) {
                                    if (found)
                                        return false;
                                } else {
                                    if (!found)
                                        return false;
                                }
                            }
                        } else {
                            for (var tagName of filterObject._tags) {
                                var found = false;
                                var reverse = false;
                                if (tagName[0] === '-') {
                                    reverse = true;
                                    tagName = tagName.substr(1);
                                }

                                for (var filterTagName of Array.from(channelTags.values())) {
                                   if (filterTagName.indexOf(tagName) >= 0) {
                                       if (reverse)
                                           return false;
                                       channelTags.delete(filterTagName);
                                       found = true;
                                       break;
                                   }
                                }

                                if (!found && !reverse) 
                                    return false;
                            }
                        }
                    }
                }
        	}
      	}
      	return true;
    }

}
