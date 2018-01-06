import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../channel.service';
import { Channel } from '../channel';
import { ChannelFilterObject } from '../channel-filter-object';
import { Router, NavigationEnd } from '@angular/router';

declare var browser: any;
declare var chrome: any;

declare var checkboxes: any;


@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit {
	// channels: Channel[];
	get channels(): Channel[] {
		return this.channelService.getChannels();
	}
	filter: ChannelFilterObject = new ChannelFilterObject();

	isHidden: boolean = false;

	constructor(
		private router: Router,
		private channelService: ChannelService
	) { 
	}

	ngOnInit() {
		var self = this;
		function processItem(item) {
			if (chrome && chrome.runtime.error) {
                console.log(chrome.runtime.error);
                return;
            }

			if (item.channelFilterObject !== undefined) {
				self.filter.searchString = item.channelFilterObject.searchString;
				self.filter.inSubscriptions = item.channelFilterObject.inSubscriptions;
				self.filter.hasNewVideos = item.channelFilterObject.hasNewVideos;
				self.filter.isNoted = item.channelFilterObject.isNoted;
				self.filter.isTagged = item.channelFilterObject.isTagged;
				self.filter.isNotTagged = item.channelFilterObject.isNotTagged;
				self.filter.tagsSearchString = item.channelFilterObject.tagsSearchString;
				if (typeof item.channelFilterObject.tagsStrictMode !== 'undefined')
					self.filter.tagsStrictMode = item.channelFilterObject.tagsStrictMode;
			}
			
			self.saveChannelFilterToStorage();
		}
		if (typeof browser !== 'undefined') {
			browser.storage.sync.get("channelFilterObject").then(processItem, error => console.log(error) );
		} else {
			chrome.storage.sync.get("channelFilterObject", processItem);
		}
		
	}

	saveChannelFilterToStorage(): void {
		var self = this;
		function processItem (error) {
			if (error)
				console.log(error);

			if (chrome && chrome.runtime.error)
				console.log(chrome.runtime.error);

			setTimeout(()=>{self.saveChannelFilterToStorage()}, 1000);
		}

		let objectToSave = {
			searchString: self.filter.searchString,
			inSubscriptions: self.filter.inSubscriptions,
			hasNewVideos: self.filter.hasNewVideos,
			isNoted: self.filter.isNoted,
			isTagged: self.filter.isTagged,
			isNotTagged: self.filter.isNotTagged,
			tagsSearchString: self.filter.tagsSearchString,
			tagsStrictMode: self.filter.tagsStrictMode,
		};

		if (typeof browser !== 'undefined') {
			browser.storage.sync.set({
				channelFilterObject: objectToSave
			}).then(processItem, error => processItem(error) );
		} else {
			chrome.storage.sync.set({
				channelFilterObject: objectToSave
			}, processItem);
		}
	}

	onDrag(event, channel): void {
		event.dataTransfer.setData("channelId", channel.id);
	}

	onSelect(channel: Channel): void {
	}
	
	isSelected(channel: Channel): boolean {
		var currentUrl = this.router.url;
		return currentUrl.endsWith(channel.id);
	}

	toggleCheckboxes(): void {
		checkboxes.setAttribute('hidden', checkboxes.getAttribute('hidden') == 'false'? 'true' : 'false');;
	}

	filtersAreOpened(): boolean {
		if (checkboxes.getAttribute('hidden') == null) 
			checkboxes.setAttribute('hidden', 'false');
		
		return checkboxes.getAttribute('hidden') == 'false';
	}
}
