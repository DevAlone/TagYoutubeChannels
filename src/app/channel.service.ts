"use strict";

import { Injectable } from '@angular/core';
import { Channel } from './channel';
import { Tag } from './tag';
import { TagService } from './tag.service';

declare var browser: any;
declare var Arrays: any;


@Injectable()
export class ChannelService {
    // private channelsCache: { [key:string]:Channel; } = {};
    private channelList: Channel[] = [];
    private isInitialized: boolean = false;

    constructor(
        private tagService: TagService
    ) { 
        this.loadFromStorage();
    }

    getChannels(): Channel[] {
        return this.channelList;
    }

    getChannelById(channelId: string): Promise<Channel> {
        var self = this;
        return new Promise<Channel>((resolve, reject) => {
            function waiter() {
                if (self.isInitialized)
                    resolve(self.channelList.find(channel => channel.id === channelId));
                else
                    setTimeout(waiter, 100);
            }
            waiter();
        });
    }

    saveChannel(channel: Channel): void {
        var storedChannels = {};

        for (var c of this.channelList) {
            storedChannels[c.id] = {
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
    }

    loadFromStorage(): Promise<void> {
        var self = this;

        return new Promise(function (resolve, reject) {
            browser.storage.sync.get("channels").then(item => {
                // for (var member in self.channels) 
                //     delete self.channels[member];
                self.channelList.splice(0, self.channelList.length);

                for (var channelId in item.channels) {
                    var channel = item.channels[channelId];

                    self.channelList.push(new Channel({
                        id: channelId,
                        title: channel.title,
                        iconUrl: channel.iconUrl,
                        newVideosCount: channel.newVideosCount,
                        inSubscriptions: channel.inSubscriptions,
                        note: channel.note
                    }));
                }

                self.isInitialized = true;

                resolve();
            }, error => {
                reject(error);
            });
        });
    }
}