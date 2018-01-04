import { Injectable } from '@angular/core';
import { TagService } from './tag.service';
import { ChannelService } from './channel.service';
import { Channel } from './channel';
import { Tag } from './tag';

declare var browser: any;


@Injectable()
export class ChannelTagRelationService {
	private relations: any = [];

	private isInitialized: boolean = false;

	constructor(
		private tagService: TagService,
		private channelService: ChannelService
	) { 
		this.loadFromStorage();
	}

	addTagToChannel(channel: Channel, tag: Tag): Promise<void> {
		var self = this;
		return new Promise<void>((resolve, reject) => {
			self.addRelation(channel.id, tag.id);
			self.save().then(() => resolve(), error => reject(error) );
		});
	}

	deleteTagFromChannel(channel: Channel, tag: Tag): Promise<void> {
		var self = this;
		return new Promise<void>((resolve, reject) => {
			self.deleteRelation(channel.id, tag.id);
			self.save().then(() => resolve(), error => reject(error) );
		});
	}

	clearTagsFromChannel(channel: Channel): Promise<void> {
		var self = this;
		return new Promise<void>((resolve, reject) => {
			for (var tag of Array.from(channel.tags.values()))
				self.deleteTagFromChannel(channel, tag);
			
			resolve();
		});
	}

	clearChannelsFromTag(tag: Tag): Promise<void> {
		var self = this;
		return new Promise<void>((resolve, reject) => {
			for (var channel of Array.from(tag.channels.values()))
				self.deleteTagFromChannel(channel, tag);
			
			resolve();
		});
	}

	addRelation(channelId: string, tagId: number): void {
		for (var relation of this.relations) {
			if (relation.channelId === channelId && relation.tagId === tagId)
				return;
		}

		this.relations.push({
			channelId: channelId,
			tagId: tagId
		});

		this.channelService.getChannelById(channelId).then(channel => {
			this.tagService.getTagById(tagId).then(tag => {
				channel.tags.add(tag);
				tag.channels.add(channel);
			});
		})
	}

	deleteRelation(channelId: string, tagId: number): void {
		var tmp = [];
		// very very bad solution
		for (var relation of this.relations) {
			if (relation.channelId !== channelId || relation.tagId !== tagId)
				tmp.push(relation);
		}

		this.relations = tmp;

		this.channelService.getChannelById(channelId).then(channel => {
			this.tagService.getTagById(tagId).then(tag => {
				channel.tags.delete(tag);
				tag.channels.delete(channel);
			});
		})
	}

	save(): Promise<void> {
		var self = this;
		return new Promise<void>((resolve, reject) => {
			browser.storage.sync.set({
				channel_tag_relations: self.relations
			}).then(() => resolve(), error => reject(error) );
		});
	}


	loadFromStorage(): Promise<void> {
		var self = this;
		return new Promise<void>((resolve, reject) => {
			browser.storage.sync.get("channel_tag_relations").then(item => {
				self.relations.splice(0, self.relations.length);
				if (item.channel_tag_relations === undefined) {
					resolve();
					return;
				}

				for (var relation of item.channel_tag_relations) {
					self.addRelation(relation.channelId, relation.tagId);
				}
				self.isInitialized = true;
				resolve();
		    }, error => reject(error) );
		});
	}
}
