import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { Tag } from './tag';

declare var browser: any;


@Injectable()
export class TagService {
  private tags: { [key:number]:Tag; } = {};

  constructor() { 
    this.loadFromStorage();
  }

  getTags(): Tag[] {
    var result: Tag[] = [];
    for (var tagId in this.tags) {
      var tag = this.tags[tagId];
      result.push(tag);
    }
    return result;
  }

  getTagById(tagId: number): Tag {
    return this.tags[tagId];
  }

  saveTag(tag: Tag): void {
    this.tags[tag.id] = tag;
    // TODO: save it
  }

  // getTagById(tagId: number): Tag {
  //   return this.tags.find(tag => tag.id == tagId);
  // }

  // getTags(): Observable<Tag[]> {
  //   return Observable.fromPromise(this.getFromStorage());
  // }

  // // returns true if tag was added, false otherwise
  // addTag(tagName): Observable<void> {
  //   var self = this;

  //   return Observable.fromPromise(new Promise<void>(function(resolve, reject) {
  //     browser.storage.sync.get("tags").then(function(item) {
  //       var tags = item.tags;
  //       if (tags === undefined) {
  //           tags = {
  //               lastId: 0,
  //               items: {},
  //           };
  //       }

  //       for (var id in tags.items) {
  //           var tag = tags.items[id];
  //           if (tagName === tag.name) {
  //               reject("We already have tag \"" + tagName + "\"");
  //               return;
  //           }
  //       }

  //       ++tags.lastId;
  //       tags.items[tags.lastId] = {
  //           name: tagName,
  //       }

  //       browser.storage.sync.set({
  //           tags: tags,
  //       }).then(function() {
  //           self.updateFromStorage();
  //           resolve();
  //       })
  //     }, function(error) {
  //         console.log(error);
  //         reject();
  //     });
  //   }));
  // }

  // updateFromStorage() {
  //   this.getFromStorage();
  // }

  loadFromStorage(): Promise<void> {
    var self = this;

    return new Promise<void>(function(resolve, reject) {
        browser.storage.sync.get("tags").then(function(item) {
          if (item.tags === undefined) {
            item.tags = {
              lastId: 0,
              items: {},
            };
          }

          for (var member in self.tags) 
            delete self.tags[member];

          for (var id in item.tags.items) {
            var tag = item.tags.items[id];
            var tagId = parseInt(id);
            if (isNaN(tagId)) {
              console.log("some shit happened: tag id is not a number");
              continue;
            }

            self.tags[id] = new Tag({
              id: tagId,
              name: tag.name
            })
          }
          resolve();
      }, function(error) {
        reject(error);
      });
    });
  }

}
