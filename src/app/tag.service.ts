import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { Tag } from './tag';

declare var browser: any;


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
            browser.storage.sync.get("tags").then(function(item) {
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
            }, function(error) {
                reject(error);
            });
        });
    }

    loadFromStorage(): Promise<void> {
        var self = this;

        return new Promise<void>(function(resolve, reject) {
            browser.storage.sync.get("tags").then(function(item) {
                if (item.tags === undefined) {
                    item.tags = {
                      // lastId: 0,
                        items: {},
                    };
                }

                self.tagList.splice(0, self.tagList.length);

                for (var id in item.tags.items) {
                    var tag = item.tags.items[id];
                    var tagId = parseInt(id);
                    if (isNaN(tagId)) {
                        console.log("some shit happened: tag id is not a number");
                        continue;
                    }

                    self.tagList.push(new Tag({
                        id: tagId,
                        name: tag.name
                    }));
                }
                self.isInitialized = true;
                resolve();
            }, function(error) {
                reject(error);
            });
        });
    }

    saveToStorage(): Promise<void> {
        var self = this;
        return new Promise<void>(function(resolve, reject) {
            var tags = {
                items: {},
            }

            for (var tag of self.tagList) {
                tags.items[tag.id] = {
                    name: tag.name
                };
            }

            browser.storage.sync.set({
                tags: tags
            }).then(function() {
                resolve();
            }, function(error) {
                reject(error);
            });
        });
    }
}
