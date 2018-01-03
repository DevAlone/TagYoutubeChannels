import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../channel.service';
import { Channel } from '../channel';
import { Router, NavigationEnd } from '@angular/router';

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

	constructor(
		private router: Router,
		private channelService: ChannelService
	) { 
	}

	ngOnInit() {
		// this.updateChannels();
	}

	// updateChannels(): void {
	// 	this.channelService.getChannels()
	// 		.subscribe(channels => this.channels = channels);
	// }

	onSelect(channel: Channel): void {
	}
	
	isSelected(channel: Channel): boolean {
		var currentUrl = this.router.url;
		return currentUrl.endsWith(channel.id);
	}
}
