import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { ChannelsComponent } from './channels/channels.component';
import { TagsComponent } from './tags/tags.component';
import { ChannelDetailComponent } from './channel-detail/channel-detail.component';
import { MessageComponent } from './message/message.component';
import { FilterChannelPipe } from './filter-channel.pipe';
import { StartPageComponent } from './start-page/start-page.component';
import { TagDetailComponent } from './tag-detail/tag-detail.component';
import { ChannelTagsComponent } from './channel-tags/channel-tags.component';
import { SavingAnimationComponent } from './saving-animation/saving-animation.component';
import { FrameComponent } from './frame/frame.component';

import { ChannelService } from './channel.service';
import { TagService } from './tag.service';
import { MessageService } from './message.service';
import { ChannelTagRelationService } from './channel-tag-relation.service';
import { SavingAnimationService } from './saving-animation.service';
import { LazyWatcherService } from './lazy-watcher.service';
import { ParserService } from './parser.service';
import { FrameService } from './frame.service';
import { StorageService } from './storage.service';
import { WatchOnYoutubeLinkComponent } from './watch-on-youtube-link/watch-on-youtube-link.component';
import { DebugPageComponent } from './debug-page/debug-page.component';


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
        SavingAnimationComponent,
        FrameComponent,
        WatchOnYoutubeLinkComponent,
        DebugPageComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpModule
    ],
    providers: [ 
        ChannelService, 
        TagService, 
        MessageService, 
        ChannelTagRelationService, 
        SavingAnimationService, 
        LazyWatcherService ,
        ParserService,
        FrameService,
        StorageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
