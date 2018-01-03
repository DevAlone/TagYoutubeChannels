import { Injectable } from '@angular/core';
import { Channel } from './channel';
import { Tag } from './tag';
import { TagService } from './tag.service';

declare var browser: any;
declare var Arrays: any;


@Injectable()
export class ChannelService {
  private channels: { [key:string]:Channel; } = {};
  // selectedChannel: Channel;

  constructor(private tagService: TagService) { 
    // this.getFromStorage();
    // this.loadFakeData();
    this.loadFromStorage();
  }

  getChannels(): Channel[] {
    var result: Channel[] = [];
    for (var channelId in this.channels) {
      var channel = this.channels[channelId];
      result.push(channel);
    }

    return result;
  }

  getChannelById(channelId: string): Promise<Channel> {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.loadFromStorage().then(function() {
        resolve(self.channels[channelId])
      }, function(error) {
        reject(error);
      });
    }); 
  }

  saveChannel(channel: Channel): void {
    this.channels[channel.id] = channel;
    
    var storedChannels = {};

    for (var channelId in this.channels) {
      var c = this.channels[channelId];
      storedChannels[channelId] = {
        title: c.title,
        iconUrl: c.iconUrl,
        newVideosCount: c.newVideosCount,
        inSubscriptions: c.inSubscriptions,
        note: c.note,
      }
    }

    browser.storage.sync.set({
      channels: storedChannels
    });

    var relations = [];

    for (var channelId in this.channels) {
      var ch = this.channels[channelId];
      // console.log(ch);
      // console.log(ch.tags);
      for (var tag of Array.from(ch.tags.values())) {
        relations.push({
          tagId: tag.id,
          channelId: channelId
        })
      }
    }

    browser.storage.sync.set({
      channel_tag_relations: relations
    });
  }

  loadFromStorage(): Promise<void> {
    var self = this;

    return new Promise(function (resolve, reject) {
      browser.storage.sync.get("channels").then(item => {
        for (var member in self.channels) 
          delete self.channels[member];

        for (var channelId in item.channels) {
          var channel = item.channels[channelId];

          self.channels[channelId] = new Channel({
            id: channelId,
            title: channel.title,
            iconUrl: channel.iconUrl,
            newVideosCount: channel.newVideosCount,
            inSubscriptions: channel.inSubscriptions,
            note: channel.note
          });
        }

        // observer.complete();
        

        browser.storage.sync.get("channel_tag_relations").then(item => {
          if (item.channel_tag_relations === undefined)
            return;
          
          for (var relation of item.channel_tag_relations) {
            var tag = self.tagService.getTagById(relation.tagId);
            self.channels[relation.channelId].tags.add(tag);
          }
          resolve();
        }, error => {
          reject(error);
        });
      }, error => {
        reject(error);
      });
    });
  }
}