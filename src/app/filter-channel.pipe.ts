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
        }
  		}
  	}
  	return true;
  }

}
