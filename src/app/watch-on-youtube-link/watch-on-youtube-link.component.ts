import { Component, OnInit, Input } from '@angular/core';
import { Channel } from '../channel';
import { FrameService } from '../frame.service';


@Component({
  selector: 'app-watch-on-youtube-link',
  templateUrl: './watch-on-youtube-link.component.html',
  styleUrls: ['./watch-on-youtube-link.component.css']
})
export class WatchOnYoutubeLinkComponent implements OnInit {
	@Input()
	channel: Channel;

	constructor(private frameService: FrameService) { }

	ngOnInit() {
	}

	showYoutubeChannel() {
		this.frameService.open(this.channel.url);
	}
}
