import { Component, OnInit, Input } from '@angular/core';
import { Channel } from '../channel';
import { Tag } from '../tag';
import { ChannelTagRelationService } from '../channel-tag-relation.service';


@Component({
  selector: 'app-channel-tags',
  templateUrl: './channel-tags.component.html',
  styleUrls: ['./channel-tags.component.css']
})
export class ChannelTagsComponent implements OnInit {
	@Input()
	channel: Channel;

	constructor(private channelTagService: ChannelTagRelationService) { }

	ngOnInit() {
	}

	deleteTag(tag: Tag): void {
		this.channelTagService.deleteTagFromChannel(this.channel, tag);
	}

}
