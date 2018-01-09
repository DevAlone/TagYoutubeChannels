import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../channel.service';
import { Channel } from '../channel';
import { ChannelFilterObject } from '../channel-filter-object';
import { Router, NavigationEnd } from '@angular/router';
import { StorageService } from '../storage.service';

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
		private channelService: ChannelService,
		private storageService: StorageService
	) { 
	}

	ngOnInit() {
		var self = this;

		self.storageService.removeSync("channelFilterObject").then(
			() => console.log("OK"),
			error => console.log(error)
		);
	}

	saveChannelFilterToStorage(): void {
		var self = this;
		function processItem (error) {
			if (error)
				console.log(error);

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

		self.storageService.setLocal({
			cfo_: objectToSave
		}).then(processItem, processItem);
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
