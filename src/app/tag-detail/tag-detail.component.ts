import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Channel } from '../channel';
import { Tag } from '../tag';
import { TagService } from '../tag.service';
import { ChannelService } from '../channel.service';
import { ChannelTagRelationService } from '../channel-tag-relation.service';
import { MessageService } from '../message.service';


@Component({
  selector: 'app-tag-detail',
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.css']
})
export class TagDetailComponent implements OnInit {
	tag: Tag;
	private sub: any;

	constructor(
		private route: ActivatedRoute,
		private tagService: TagService,
		private channelTagService: ChannelTagRelationService,
		private messageService: MessageService,
		private channelService: ChannelService
	) { }

	ngOnInit() {
		var self = this;
		var tagId = this.route.snapshot.params['id'];

		this.tagService.getTagById(tagId).then(tag => {
			self.tag = tag;
		});

		this.sub = this.route.params.subscribe(params => {
			self.tagService.getTagById(params['id']).then(tag => {
				self.tag = tag;
			});
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	clearChannels(): void {
		if(!confirm("Are you sure? It will remove all channels from tag \"" + this.tag.name + "\"")) 
			return;

		this.channelTagService.clearChannelsFromTag(this.tag).then(() => {
			this.messageService.addMessage("Channels were successfully removed");
		});
	}

	deleteChannel(channel: Channel): void {
		this.channelTagService.deleteTagFromChannel(channel, this.tag);
	}

	dropChannel(event): void {
		event.preventDefault();
		var channelId = event.dataTransfer.getData("channelId");

		if (typeof channelId !== 'string') {
			this.messageService.addMessage("This doesn't look like channel");
			return;
		}
		
		var self = this;

		this.channelService.getChannelById(channelId).then(channel => {
			if (self.tag.channels.has(channel)) {
				self.messageService.addMessage("Tag already has this channel");
				return;
			}

			self.channelTagService.addTagToChannel(channel, self.tag);
		}, error => {
			console.log(error);
			this.messageService.addMessage("Some shit happened");
			return;
		});
	}

	noteChanged(channel: Channel): void {
		this.channelService.saveChannel(channel);
	}

}
