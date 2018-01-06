import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Channel } from '../channel';
import { Tag } from '../tag';
import { TagService } from '../tag.service';
import { ChannelService } from '../channel.service';
import { ChannelTagRelationService } from '../channel-tag-relation.service';
import { MessageService } from '../message.service';
import { LazyWatcherService } from '../lazy-watcher.service';
import { LazyWatcher } from '../lazy-watcher';


@Component({
  selector: 'app-tag-detail',
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.css']
})
export class TagDetailComponent implements OnInit {
	tag: Tag;
	private sub: any;
	private nameWatcher: LazyWatcher;
	private channelWatchers: { [key:number]:LazyWatcher } = {};

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private tagService: TagService,
		private channelTagService: ChannelTagRelationService,
		private messageService: MessageService,
		private channelService: ChannelService,
		private lazyWatcherService: LazyWatcherService
	) {
		var self = this;
		this.nameWatcher = this.lazyWatcherService.getWatcher(() => {
			self.tagService.saveTag(this.tag);
		});
	}

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

	deleteTag() {
		if(!confirm("Are you sure? It will delete tag \"" + this.tag.name + "\""))
			return;

		var self = this;

		this.channelTagService.deleteTag(self.tag).then(() => {
			self.messageService.addMessage("tag was succesfully removed");
			self.router.navigateByUrl("/");
		}, error => self.messageService.addMessage(error));
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
		if (!this.channelWatchers[channel.id]) {
			console.log('creating watcher');
			var self = this;
			let watchingChannel = channel;
			this.channelWatchers[channel.id] = this.lazyWatcherService.getWatcher(() => {
				self.channelService.saveChannel(watchingChannel);
			});
		}

		this.channelWatchers[channel.id].setChanging();
	}

	nameChanged(): void {
		// this.tagService.saveTag(this.tag);
		this.nameWatcher.setChanging();
	}

}
