import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Injectable()
export class FrameService {
	public frameIsOpened: boolean = false;
	private channelUrl: any;

	constructor(public sanitizer: DomSanitizer) { }

	public open(url: string): void {
		this.channelUrl =
			this.sanitizer.bypassSecurityTrustResourceUrl(url);

		this.frameIsOpened = true;
	}

	public close(): void {
		this.frameIsOpened = false;
	}

	public getFrameUrl(): any {
		return this.channelUrl;
	}
}
