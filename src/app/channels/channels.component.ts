import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../channel.service';
import { Channel } from '../channel';
import { ChannelFilterObject } from '../channel-filter-object';
import { Router, NavigationEnd } from '@angular/router';

declare var browser: any;
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

	constructor(
		private router: Router,
		private channelService: ChannelService
	) { 
	}

	ngOnInit() {
		var self = this;
		browser.storage.sync.get("channelFilterObject").then(function(storage) {
			if (storage.channelFilterObject !== undefined)
				self.filter = storage.channelFilterObject;
			self.saveChannelFilterToStorage();
		}, function(error) {
			console.log(error);
			self.saveChannelFilterToStorage();
		});
	}

	saveChannelFilterToStorage(): void {
		browser.storage.sync.set({
			channelFilterObject: this.filter
		}).then(()=>{
			setTimeout(()=>{this.saveChannelFilterToStorage()}, 1000);
		}, (error)=>{
			console.log(error);
			setTimeout(()=>{this.saveChannelFilterToStorage()}, 1000);
		});
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
