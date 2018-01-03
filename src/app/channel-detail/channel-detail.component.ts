import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Tag } from '../tag';
import { Channel } from '../channel';
import { ChannelService } from '../channel.service';
import { TagService } from '../tag.service';
import { MessageService } from '../message.service';


@Component({
  selector: 'app-channel-detail',
  templateUrl: './channel-detail.component.html',
  styleUrls: ['./channel-detail.component.css']
})
export class ChannelDetailComponent implements OnInit {
	channel: Channel;
	private sub: any;

	constructor(
		private route: ActivatedRoute,
    	private channelService: ChannelService,
    	private location: Location,
    	public tagService: TagService,
    	private messageService: MessageService
	) { }

	ngOnInit() {
		var self = this;
		var channelId = this.route.snapshot.params['id'];
		this.channelService.getChannelById(channelId).then(channel => {
			self.channel = channel;
		});

		this.sub = this.route.params.subscribe(params => {
			self.channelService.getChannelById(params['id']).then(channel => {
				self.channel = channel;
			});
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	// updateChannel(): void {
	// 	const id = this.route.snapshot.paramMap.get('id');
	// 	this.channelService.getChannel(id)
	// 	 	.subscribe(channel => this.channel = channel);
	// }

	dropTag(event): void {
		event.preventDefault();
		var tagId = event.dataTransfer.getData("tagId");
		tagId = parseInt(tagId);

		if (isNaN(tagId)) {
			this.messageService.addMessage("This doesn't look like tag");
			return;
		}
		
		var tag = this.tagService.getTagById(tagId);
		
		if (this.channel.tags.has(tag)) {
			this.messageService.addMessage("Channel already has this tag");
			return;
		}

		this.channel.tags.add(tag);
		
		this.save();
	}

	deleteTag(tag: Tag): void {
		tag.channels.delete(this.channel);
		this.channel.tags.delete(tag);
		
		// this.save();
		this.channelService.saveChannel(this.channel);
		this.tagService.saveTag(tag);
	}

	noteChanged(): void {
		this.save();
	}

	clearTags(): void {
		if(!confirm("Are you sure? It will remove all tags from channel \"" + this.channel.title + "\"")) 
			return;

		for (var tag of Array.from(this.channel.tags.values())) {
			this.deleteTag(tag);
		}

		// this.channel.tags.clear();
		// TODO: implement it
		this.save();
		this.messageService.addMessage("Tags were successfully removed");
	}

	save(): void {
		this.channelService.saveChannel(this.channel);
	}
}
