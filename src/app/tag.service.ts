import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { Tag } from './tag';

declare var browser: any;
declare var chrome: any;


@Injectable()
export class TagService {
    // private tags: { [key:number]:Tag; } = {};
    private tagList: Tag[] = [];
    private isInitialized = false;

    constructor() { 
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

            self.tagList.push(new Tag({
                id: maximumId + 1,
                name: tagName
            }));

            self.saveToStorage().then(function() {
                resolve();
            }, function(error) {
                reject(error);
                // NOTE: it can delete something else
                self.tagList.pop();
            });
        });
    }

    _deleteTag(tag: Tag): Promise<void> {
        // TODO: fix it
        var self = this;
        return new Promise((resolve, reject) => {
            delete self.tagList[self.tagList.indexOf(tag)];
            self.saveToStorage().then(() => {
                self.loadFromStorage().then( () => resolve(), error => reject(error) );
            }, error => reject(error) );
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
            }, error => reject(error) );
        });
    }

    saveToStorage(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            var self = this;
            self.getTagsFromStorage().then((tags) => {
                for (var tag of self.tagList) {
                    if (tags[tag.id]) {
                        tags[tag.id].name = tag.name;
                    } else {
                        tags[tag.id].name = {
                            name: tag.name
                        };
                    }
                }

                var objToSave = {};

                for (var tagId in tags) {
                    var _tag = tags[tagId];
                    objToSave["tag_" + tagId] = tag;
                }

                if (typeof browser !== 'undefined') {
                    browser.storage.sync.set(objToSave).then(resolve, reject);
                } else {
                    chrome.storage.sync.set(objToSave, () => {
                        if (chrome && chrome.runtime.error) {
                            reject(chrome.runtime.error);
                            return;
                        }
                        resolve();
                    });
                }
            });
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
