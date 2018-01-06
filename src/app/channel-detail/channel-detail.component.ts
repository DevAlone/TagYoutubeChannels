import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Tag } from '../tag';
import { Channel } from '../channel';
import { ChannelService } from '../channel.service';
import { TagService } from '../tag.service';
import { MessageService } from '../message.service';
import { ChannelTagRelationService } from '../channel-tag-relation.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SavingAnimationService } from '../saving-animation.service';
import { LazyWatcherService } from '../lazy-watcher.service';
import { LazyWatcher } from '../lazy-watcher';

declare var videoFrame: any;


@Component({
  selector: 'app-channel-detail',
  templateUrl: './channel-detail.component.html',
  styleUrls: ['./channel-detail.component.css']
})
export class ChannelDetailComponent implements OnInit {
	channel: Channel;
	private sub: any;
	private noteWatcher: LazyWatcher;

	constructor(
		public sanitizer: DomSanitizer,
		private route: ActivatedRoute,
    	private channelService: ChannelService,
    	private location: Location,
    	public tagService: TagService,
    	private messageService: MessageService,
    	private channelTagService: ChannelTagRelationService,
    	private savingAnimationService: SavingAnimationService,
    	private lazyWatcherService: LazyWatcherService
	) { 
		var self = this;
		this.noteWatcher = this.lazyWatcherService.getWatcher(() => {
			self.save();
		});
	}

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

	dropTag(event): void {
		event.preventDefault();
		var tagId = event.dataTransfer.getData("tagId");
		tagId = parseInt(tagId);

		if (isNaN(tagId)) {
			this.messageService.addMessage("This doesn't look like tag");
			return;
		}
		
		var self = this;

		this.tagService.getTagById(tagId).then(tag => {
			if (self.channel.tags.has(tag)) {
				self.messageService.addMessage("Channel already has this tag");
				return;
			}

			self.channelTagService.addTagToChannel(self.channel, tag);
		}, error => {
			console.log(error);
			return;
		});
	}


	deleteTag(tag: Tag): void {
		this.channelTagService.deleteTagFromChannel(this.channel, tag);
	}

	// userIsTyping: boolean = false;
	// noteIsChanged: boolean = false;

	noteChanged(): void {
		this.noteWatcher.setChanging();
		// this.noteIsChanged = true;
		// this.userIsTyping = true;
	}

	// _checkNote(): void {
	// 	if (this.noteIsChanged && !this.userIsTyping) {
	// 		this.noteIsChanged = false;
	// 		this.save();
	// 	}
	// 	this.userIsTyping = false;
	// }

	clearTags(): void {
		if(!confirm("Are you sure? It will remove all tags from channel \"" + this.channel.title + "\"")) 
			return;

		this.channelTagService.clearTagsFromChannel(this.channel).then(() => {
			this.messageService.addMessage("Tags were successfully removed");	
		});
	}

	save(): void {
		this.savingAnimationService.startSaving();
		var self = this;
		this.channelService.saveChannel(this.channel).then(() => {
			self.savingAnimationService.stopSaving();
		}, () => {
			self.savingAnimationService.stopSaving();
		});
	}
	private channelUrl: any = undefined;
	// private channelUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
	// 	this.channel.url
	// );

	getChannelUrl(): any {
		if (this.channel && !this.channelUrl)
			this.channelUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
				this.channel.url
			);
		return this.channelUrl;
	}
}
