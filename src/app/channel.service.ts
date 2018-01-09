"use strict";

import { Injectable } from '@angular/core';
import { Channel } from './channel';
import { Tag } from './tag';
import { TagService } from './tag.service';
import { SavingAnimationService } from './saving-animation.service';
import { StorageService } from './storage.service';

declare var LZString: any;
declare var browser: any;
declare var chrome: any;


@Injectable()
export class ChannelService {
    // private channelsCache: { [key:string]:Channel; } = {};
    private channelList: Channel[] = [];
    private isInitialized: boolean = false;

    constructor(
        private tagService: TagService,
        private savingAnimationService: SavingAnimationService,
        private storageService: StorageService
    ) { 
        this.loadFromStorage().then(() => {}, error => console.log("ERROR: " + error) );
    }

    addOrUpdateChannels(channels: Channel[]): Promise<void> {
        var self = this;
        return new Promise<void>((resolve, reject) => {
            self.savingAnimationService.startSaving();

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

            function processResult(error) {
                if (error) {
                    reject(error);
                    return;
                }
                self.savingAnimationService.stopSaving();
                resolve();
            }

            self.saveToStorage().then(processResult, processResult);
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
            // self.saveToStorage().then(resolve, reject);
            self.saveChannels(self.channelList).then(resolve, reject);
        });
    }

    saveChannels(channels: Channel[]): Promise<void> {
        var self = this;
        return new Promise<void>((resolve, reject) => {
            self.savingAnimationService.startSaving();
            function processResult(error) {
                if (error) {
                    reject(error);
                    return;
                }
                self.savingAnimationService.stopSaving();
                resolve();
            }
            self.saveToStorage().then(processResult, processResult);
        });
    }

    saveToStorage(): Promise<void> {
        var self = this;

        return new Promise<void>((resolve, reject) => {
            var syncObjToSave = {};
            var localObjToSave = {};
            var objToDelete = [];

            for (var channel of self.channelList) {
                objToDelete.push('channel_' + channel.id);

                localObjToSave['c_' + channel.id] = {
                    title: channel.title,
                    iconUrl: channel.iconUrl,
                    newVideosCount: channel.newVideosCount,
                    inSubscriptions: channel.inSubscriptions,
                }

                var objStr = "";

                objStr += channel.note.replace('\\', '\\\\') + '\\';

                for (var tag of Array.from(channel.tags.values())) {
                    objStr += tag.id + ',';
                }
                if (channel.tags.size > 0)
                    objStr = objStr.substr(0, objStr.length - 1);

                syncObjToSave['cs_' + channel.id] = LZString.compressToUTF16(objStr);
            }

            self.storageService.setLocal(localObjToSave).then(() => {
                self.storageService.setSync(syncObjToSave).then(() => {
                    self.storageService.removeSync(objToDelete).then(() => {
                        resolve();
                    }, reject);
                }, reject);
            }, reject);
        });
    }

    loadFromStorage(): Promise<void> {
        var self = this;

        return new Promise(function (resolve, reject) {
            self.getChannelsFromStorage().then((channels) => {
                self.channelList.splice(0, self.channelList.length);

                var channelsFromStorage = {};

                for (var channelId in channels.syncChannels) {
                    var channel = channels.syncChannels[channelId];

                    let newChannel = new Channel({
                        id: channelId
                    });

                    if (typeof channel === 'object') {
                        newChannel.title = channel.title;
                        newChannel.iconUrl = channel.iconUrl || "";
                        newChannel.newVideosCount = channel.newVideosCount;
                        newChannel.inSubscriptions = channel.inSubscriptions;
                        newChannel.note = channel.note || "";
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
                    } else if (typeof channel === 'string') {
                        var data: string = LZString.decompressFromUTF16(channel);

                        var indexOfDelimiter = data.lastIndexOf('\\');
                        var firstPart = data.substring(0, indexOfDelimiter);
                        var secondPart = data.substring(indexOfDelimiter + 1);

                        newChannel.note = firstPart.replace('\\\\', '\\');
                        var tags = secondPart.split(',');

                        if (tags) {
                            for (var strTagId of tags) {
                                var numberTagId: number = parseInt(strTagId);
                                if (!isNaN(numberTagId)) {
                                    self.tagService.getTagById(numberTagId).then(tag => {
                                        if (tag) {
                                            newChannel.tags.add(tag);
                                            tag.channels.add(newChannel);
                                        }
                                    });
                                }
                            }
                        }

                        newChannel.title = "UNDEFINED";
                        newChannel.iconUrl = "";
                        newChannel.newVideosCount = 0;
                        newChannel.inSubscriptions = false;
                    }

                    channelsFromStorage[channelId] = newChannel;    
                }

                for (var channelId in channels.localChannels) {
                    var channel = channels.localChannels[channelId];

                    channelsFromStorage[channelId].title = channel.title;
                    channelsFromStorage[channelId].iconUrl = channel.iconUrl;
                    channelsFromStorage[channelId].newVideosCount = channel.newVideosCount;
                    channelsFromStorage[channelId].inSubscriptions = channel.inSubscriptions;
                }

                for (var channelId in channelsFromStorage) {
                    var newChannel = channelsFromStorage[channelId];
                    self.channelList.push(newChannel);
                }

                self.isInitialized = true;
                resolve();
            }, error => reject(error) );
        });
    }

    getChannelsFromStorage(): Promise<any> {
        var self = this
        return new Promise((resolve, reject) => {
            var channels = {
                syncChannels: {},
                localChannels: {},
            };
            function processResult(storage) {
                for (var key in storage) {
                    if (key.startsWith("channel_"))
                        channels.syncChannels[key.substr(8)] = storage[key];
                    else if (key.startsWith("cs_"))
                        channels.syncChannels[key.substr(3)] = storage[key];
                }

                self.storageService.getLocal(null).then((localStorage) => {
                    for (var key in localStorage) {
                        if (key.startsWith("c_"))
                            channels.localChannels[key.substr(2)] = localStorage[key];
                    }   
                    resolve(channels);
                }, reject);
            }

            self.storageService.getSync(null).then(
                processResult, reject
            );
        });
    }
}