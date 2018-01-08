import { Component, OnInit } from '@angular/core';
import { ParserService } from '../parser.service';
import { MessageService } from '../message.service';

declare var browser: any;


@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.css']
})
export class StartPageComponent implements OnInit {
	public isUpdating: boolean = false;

	constructor(
		private parserService: ParserService,
		private messageService: MessageService
	) { }

	ngOnInit() {
	}

	updateChannelsFromYouTube(): void {
		this.isUpdating = true;
		var self = this;

		self.parserService.update().then(() => self.isUpdating = false, error => {
			self.isUpdating = false;
			self.messageService.addMessage("failed: " + error);
		})
		
	}
}
