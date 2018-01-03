import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { ChannelsComponent } from './channels/channels.component';
import { TagsComponent } from './tags/tags.component';
import { ChannelDetailComponent } from './channel-detail/channel-detail.component';
import { ChannelService } from './channel.service';
import { TagService } from './tag.service';
import { MessageService } from './message.service';
import { MessageComponent } from './message/message.component';


@NgModule({
  declarations: [
    AppComponent,
    ChannelsComponent,
    TagsComponent,
    ChannelDetailComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [ ChannelService, TagService, MessageService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
