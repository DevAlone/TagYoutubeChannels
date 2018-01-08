import { Component, OnInit } from '@angular/core';
import { FrameService } from '../frame.service';


@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.css']
})
export class FrameComponent implements OnInit {
	constructor(
		private frameService: FrameService
	) { }
	
	ngOnInit() {
	}
	
	public get frameIsOpened(): boolean {
		return this.frameService.frameIsOpened;
	}

	close(): void {
		this.frameService.close();
	}

	getFrameUrl(): any {
		return this.frameService.getFrameUrl();
	}
}
