"use strict";

import { Injectable } from '@angular/core';
import { Channel } from './channel';
import { Tag } from './tag';
import { TagService } from './tag.service';
import { SavingAnimationService } from './saving-animation.service';

declare var Arrays: any;

declare var browser: any;
declare var chrome: any;


@Injectable()
export class ChannelService {
    // private channelsCache: { [key:string]:Channel; } = {};
    private channelList: Channel[] = [];
    private isInitialized: boolean = false;

    constructor(
        private tagService: TagService,
        private savingAnimationService: SavingAnimationService
    ) { 
        this.loadFromStorage().then(() => {}, error => console.log("ERROR: " + error) );
    }

    addOrUpdateChannels(channels: Channel[]): Promise<void> {
        var self = this;
        return new Promise<void>((resolve, reject) => {
            for (var channel of self.channelList)
                channel.inSubscriptions = false;

            for (var newChannel of channels) {
                if (!newChannel.id || !newChannel.title) {
                    continue;
                }

                var channel = self.channelList.find(_channel => _channel.id === newChannel.id);
                if (!channel) {
                    channel = newChannel;
                    self.channelList.push(channel);
                } else {
                    channel.title = newChannel.title;
                    if (newChannel.iconUrl)
                        channel.iconUrl = newChannel.iconUrl;
                    channel.newVideosCount = newChannel.newVideosCount;
                    channel.inSubscriptions = newChannel.inSubscriptions;
                }
            }

            self.saveToStorage().then(resolve, reject);
        });
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

    saveChannel(channel: Channel): Promise<void> {
        var self = this;
        return new Promise<void>((resolve, reject) => {
            self.saveToStorage().then(resolve, reject);
        });
    }

    saveChannels(channels: Channel[]): Promise<void> {
        var self = this;
        return new Promise<void>((resolve, reject) => {
            self.saveToStorage().then(resolve, reject);
        });
    }

    saveToStorage(): Promise<void> {
        var self = this;
        self.savingAnimationService.startSaving();
        return new Promise<void>((resolve, reject) => {
            self.getChannelsFromStorage().then((channels) => {
                for (var channel of self.channelList) {
                    if (!channels[channel.id]) 
                        channels[channel.id] = {}
                    
                    
                    channels[channel.id].title = channel.title;
                    channels[channel.id].iconUrl = channel.iconUrl;
                    channels[channel.id].newVideosCount = channel.newVideosCount;
                    channels[channel.id].inSubscriptions = channel.inSubscriptions;
                    channels[channel.id].note = channel.note;
                    var tags = [];
                    for (var tag of Array.from(channel.tags.values()))
                        tags.push(tag.id);

                    channels[channel.id].tags = tags;
                }

                var objToSave = {};

                for (var channelId in channels) {
                    var _channel = channels[channelId];
                    objToSave["channel_" + channelId] = _channel;
                }

                function processResult(error?:any) {
                    self.savingAnimationService.stopSaving();
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                }

                if (typeof browser !== 'undefined') {
                    browser.storage.sync.set(objToSave).then(processResult, processResult);
                } else {
                    chrome.storage.sync.set(objToSave, () => {
                        if (chrome && chrome.runtime.error) {
                            processResult(chrome.runtime.error);
                            return;
                        }
                        processResult();
                    });
                }
            });
        });
    }

    loadFromStorage(): Promise<void> {
        var self = this;

        return new Promise(function (resolve, reject) {
            self.getChannelsFromStorage().then((channels) => {
                self.channelList.splice(0, self.channelList.length);
                for (var channelId in channels) {
                    var channel = channels[channelId];

                    let newChannel = new Channel({
                        id: channelId,
                        title: channel.title,
                        iconUrl: channel.iconUrl || "",
                        newVideosCount: channel.newVideosCount,
                        inSubscriptions: channel.inSubscriptions,
                        note: channel.note || ""
                    });

                    self.channelList.push(newChannel);
                    if (channel.tags) {
                        for (var tagId of channel.tags) {
                            self.tagService.getTagById(tagId).then(tag => {
                                if (tag) {
                                    newChannel.tags.add(tag);
                                    tag.channels.add(newChannel);
                                }
                            });
                        }
                    }
                }

                self.isInitialized = true;
                resolve();
            }, error => reject(error) );
        });
    }

    getChannelsFromStorage(): Promise<any> {
        var self = this
        return new Promise((resolve, reject) => {
            var channels = {};
            function processResult(storage) {
                for (var key in storage) {
                    if (key.startsWith("channel_"))
                        channels[key.substr(8)] = storage[key];
                }
                resolve(channels);
            }

            if (typeof browser !== 'undefined') {
                browser.storage.sync.get(null).then(
                    storage => processResult(storage), 
                    error => reject(error)
                );
            } else {
                chrome.storage.sync.get(null, (storage) => {
                    if (chrome && chrome.runtime.error) {
                        reject(chrome.runtime.error);
                        return;
                    }

                    processResult(storage);
                });
            }
        });
    }
}