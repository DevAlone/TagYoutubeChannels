import { Component } from '@angular/core';
import { ParserService } from './parser.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';

	constructor(private parserService: ParserService) {}

	ngOnInit() {
		this.parserService.init();
		var self = this;

		setInterval(() => {
			self.parserService.update();
		}, 60 * 1000);
	}
}
