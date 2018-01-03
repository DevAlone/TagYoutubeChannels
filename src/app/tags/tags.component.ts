import { Component, OnInit } from '@angular/core';
import { Tag } from '../tag';
import { TagService } from '../tag.service';
import { MessageService } from '../message.service';


declare var createTagForm_tagName: any;


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
})
export class TagsComponent implements OnInit {
  // tags: Tag[] = [];
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
   //  var self = this;
  	// var tagName = createTagForm_tagName.value;
  	// if (typeof tagName !== 'string' || tagName.length === 0) {
  	// 	// alert("Tag cannot be empty!");
   //    this.messageService.addMessage("Tag cannot be empty!");
  	// 	return;
  	// }
  	
  	// this.tagService.addTag(tagName).subscribe(function() {
   //    createTagForm_tagName.value = "";
   //    self.messageService.addMessage("Tag was added succesfully!");
   //  }, function(error) {
   //    self.messageService.addMessage(error);
   //  })
  }

  // updateTags(): void {
  //   this.tagService.getTags().subscribe(tags => this.tags = tags);  
  // }

  onDrag(event, tag): void {
    event.dataTransfer.setData("tagId", tag.id);
  }

}
