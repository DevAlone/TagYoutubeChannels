import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy } from '@angular/common';
// import { HeroesComponent }      from './heroes/heroes.component';
import { ChannelsComponent } from './channels/channels.component';
import { ChannelDetailComponent } from './channel-detail/channel-detail.component';

const routes: Routes = [
	//{ path: '', redirectTo: 'main', pathMatch: 'full' },
	//{ path: 'main', component: ChannelsComponent },
	{ path: 'channel/:id', component: ChannelDetailComponent },
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
})
export class AppRoutingModule { }
