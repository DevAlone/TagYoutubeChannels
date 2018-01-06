import { Component, OnInit } from '@angular/core';
import { Tag } from '../tag';
import { TagService } from '../tag.service';
import { MessageService } from '../message.service';


declare var createTagForm_tagName: any;
declare var tagList: any;


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
})
export class TagsComponent implements OnInit {
  public isHidden: boolean = false;
  get tags(): Tag[] {
    return this.tagService.getTags();
  }

  constructor(
    private tagService: TagService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    // this.updateTags();
  }

  createTag(): void {
    var self = this;
  	var tagName = createTagForm_tagName.value;
  	if (typeof tagName !== 'string' || tagName.length === 0) {
      this.messageService.addMessage("Tag cannot be empty!");
  		return;
  	}
  	
  	this.tagService.addTag(tagName).then(function() {
      createTagForm_tagName.value = "";
      tagList.scrollTop = tagList.scrollHeight;
      self.messageService.addMessage("Tag was added succesfully!");
    }, function(error) {
      if (typeof error === "string")
        self.messageService.addMessage(error);
      else {
        self.messageService.addMessage(error.message);
        self.scrollToTag(error.tag);
      }
    })
  }

  onDrag(event, tag): void {
    event.dataTransfer.setData("tagId", tag.id);
  }

  scrollToTag(tag: Tag): void {
    for (var tagElement of tagList.children) {
      if (tagElement.getAttribute("tag-id") == tag.id) {
        tagList.scrollTop = tagElement.offsetTop - tagElement.offsetHeight;
        return;
      }
    }
  }

}
