import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy } from '@angular/common';
// import { HeroesComponent }      from './heroes/heroes.component';
import { ChannelsComponent } from './channels/channels.component';
import { ChannelDetailComponent } from './channel-detail/channel-detail.component';
import { TagDetailComponent } from './tag-detail/tag-detail.component';
import { StartPageComponent } from './start-page/start-page.component';


const routes: Routes = [
	{ path: '', redirectTo: 'index', pathMatch: 'full' },
	{ path: 'index', component: StartPageComponent },
	{ path: 'channel/:id', component: ChannelDetailComponent },
	{ path: 'tag/:id', component: TagDetailComponent },
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
})
export class AppRoutingModule { }
