import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { ChannelsComponent } from './channels/channels.component';
import { TagsComponent } from './tags/tags.component';
import { ChannelDetailComponent } from './channel-detail/channel-detail.component';
import { MessageComponent } from './message/message.component';
import { FilterChannelPipe } from './filter-channel.pipe';
import { StartPageComponent } from './start-page/start-page.component';
import { TagDetailComponent } from './tag-detail/tag-detail.component';

import { ChannelService } from './channel.service';
import { TagService } from './tag.service';
import { MessageService } from './message.service';
import { ChannelTagRelationService } from './channel-tag-relation.service';
import { ChannelTagsComponent } from './channel-tags/channel-tags.component';


@NgModule({
  declarations: [
    AppComponent,
    ChannelsComponent,
    TagsComponent,
    ChannelDetailComponent,
    MessageComponent,
    FilterChannelPipe,
    StartPageComponent,
    TagDetailComponent,
    ChannelTagsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [ ChannelService, TagService, MessageService, ChannelTagRelationService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
