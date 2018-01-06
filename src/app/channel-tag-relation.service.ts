import { Injectable } from '@angular/core';
// import { TagService } from './tag.service';
import { ChannelService } from './channel.service';
import { TagService } from './tag.service';
import { Channel } from './channel';
import { Tag } from './tag';

declare var browser: any;
declare var chrome: any;


@Injectable()
export class ChannelTagRelationService {
	private isInitialized: boolean = false;

	constructor(
		private tagService: TagService,
		private channelService: ChannelService
	) { 
	}

	addTagToChannel(channel: Channel, tag: Tag): Promise<void> {
		var self = this;
		return new Promise<void>((resolve, reject) => {
			channel.tags.add(tag);
			tag.channels.add(channel);
			self.channelService.saveChannel(channel);
		});
	}

	deleteTagFromChannel(channel: Channel, tag: Tag): Promise<void> {
		var self = this;
		return new Promise<void>((resolve, reject) => {
			channel.tags.delete(tag);
			tag.channels.delete(channel);
			self.channelService.saveChannel(channel);
		});
	}

	clearTagsFromChannel(channel: Channel): Promise<void> {
		var self = this;
		return new Promise<void>((resolve, reject) => {
			for (var tag of Array.from(channel.tags.values()))
				tag.channels.delete(channel);
			
			channel.tags.clear();
			self.channelService.saveChannel(channel);
		});
	}

	clearChannelsFromTag(tag: Tag): Promise<void> {
		var self = this;
		return new Promise<void>((resolve, reject) => {
			var channelsToSave = [];
			for (var channel of Array.from(tag.channels.values())) {
				channel.tags.delete(tag);
				channelsToSave.push(channel);
			}
			tag.channels.clear();
			self.channelService.saveChannels(channelsToSave);
		});
	}

	deleteTag(tag: Tag): Promise<void> {
		var self = this;
		return new Promise<void>((resolve, reject) => {
			var channelsToSave = [];
			for (var channel of Array.from(tag.channels.values())) {
				channel.tags.delete(tag);
				channelsToSave.push(channel);
			}
			self.channelService.saveChannels(channelsToSave).then(() => {
				self.tagService._deleteTag(tag).then(resolve, reject);
			}, reject);
		});
	}

	// addRelation(channelId: string, tagId: number): void {
	// 	var self = this;
	// 	this.channelService.getChannelById(channelId).then(channel => {
	// 		this.tagService.getTagById(tagId).then(tag => {
	// 			channel.tags.add(tag);
	// 			tag.channels.add(channel);
	// 			self.channelService.saveChannel(channel);
	// 		});
	// 	})
	// }

	// deleteRelation(channelId: string, tagId: number): void {
	// 	var self = this;
	// 	this.channelService.getChannelById(channelId).then(channel => {
	// 		this.tagService.getTagById(tagId).then(tag => {
	// 			channel.tags.delete(tag);
	// 			tag.channels.delete(channel);
	// 			self.channelService.saveChannel(channel);
	// 		});
	// 	})
	// }
}
