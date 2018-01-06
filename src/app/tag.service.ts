import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { Tag } from './tag';
import { SavingAnimationService } from './saving-animation.service';

declare var browser: any;
declare var chrome: any;


@Injectable()
export class TagService {
    // private tags: { [key:number]:Tag; } = {};
    private tagList: Tag[] = [];
    private isInitialized = false;

    constructor(private savingAnimationService: SavingAnimationService) { 
        this.loadFromStorage();
    }

    getTags(): Tag[] {
        return this.tagList;
    }

    getTagById(tagId: number): Promise<Tag> {
        var self = this;
        return new Promise<Tag>((resolve, reject) => {
            function waiter() {
                if (self.isInitialized)
                    resolve(self.tagList.find(tag => tag.id == tagId));
                else
                    setTimeout(waiter, 100);
            }
            waiter();
        });
    }

    saveTag(tag: Tag): void {
        this.saveToStorage();
    }

    addTag(tagName): Promise<void> {
        var self = this;

        return new Promise<void>(function(resolve, reject) {
            var maximumId = 0;
            for (var tag of self.tagList) {
                if (tagName === tag.name) {
                    reject({
                        type: "TagExists",
                        tag: tag,
                        message: "We already have tag \"" + tagName + "\""
                    });
                    return;
                }
                if (tag.id > maximumId)
                    maximumId = tag.id;
            }

            var tagToSave = new Tag({
                id: maximumId + 1,
                name: tagName
            });

            self.tagList.push(tagToSave);

            self.saveToStorage().then(function() {
                resolve();
            }, function(error) {
                var tmpTags = self.tagList;
                self.tagList.splice(0, self.tagList.length);
                for (var _tag of tmpTags)
                    if (_tag.id !== tagToSave.id)
                        self.tagList.push(_tag);

                reject(error);
            });
        });
    }

    _deleteTag(tag: Tag): Promise<void> {
        var self = this;
        return new Promise((resolve, reject) => {    
            var tmpTags = self.tagList.slice();
            self.tagList.splice(0, self.tagList.length);

            for (var _tag of tmpTags) {
                if (_tag.id !== tag.id)
                    self.tagList.push(_tag);
            }

            var tagStrId = 'tag_' + tag.id;

            if (typeof browser !== 'undefined') {
                browser.storage.sync.remove(tagStrId).then(resolve, reject);
            } else {
                chrome.storage.sync.remove(tagStrId, (storage) => {
                    if (chrome && chrome.runtime.error)
                        reject(chrome.runtime.error);
                    else
                        resolve();
                });
            }
        });
    }

    loadFromStorage(): Promise<void> {
        var self = this;
        
        return new Promise<void>(function(resolve, reject) {
            self.getTagsFromStorage().then(tags => {
                self.tagList.splice(0, self.tagList.length);

                for (var _id in tags) {
                    var id = parseInt(_id);
                    if (isNaN(id))
                        continue;

                    var tag = tags[id];
                    self.tagList.push(new Tag({
                        id: id,
                        name: tag.name
                    }));
                }
                self.isInitialized = true;
                
                resolve();
            }, error => { reject(error) } );
        });
    }

    saveToStorage(): Promise<void> {
        var self = this;
        self.savingAnimationService.startSaving();
        return new Promise<void>((resolve, reject) => {
            var objToSave = {};

            for (var tag of self.tagList) {
                objToSave["tag_" + tag.id] = {
                    name: tag.name
                };
            }

            function processResult(error?) {
                self.savingAnimationService.stopSaving();
                if (error)
                    reject(error);
                else
                    resolve();
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
    }

    getTagsFromStorage(): Promise<any> {
        var self = this
        return new Promise((resolve, reject) => {
            var tags = {};
            function processResult(storage) {
                for (var key in storage) {
                    if (key.startsWith("tag_")) {
                        var id = parseInt(key.substr(4));
                        if (!isNaN(id))
                            tags[id] = storage[key];
                    }
                }
                resolve(tags);
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
