import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Parser } from './parser';
import { Channel } from './channel';
import { ChannelService } from './channel.service';
import { StorageService } from './storage.service';


@Injectable()
export class ParserService {
	private parser: Parser = new Parser();

	constructor(
		private http: Http,
		private channelService: ChannelService,
		private storageService: StorageService
	) { }

	public init(): void {
		// this.update();
		this.storageService.removeSync('myLastChannel');
	}

	public update(): Promise<void> {
		var self = this;

		return new Promise<void>((resolve, reject) => {
			console.log('updating...');

			this.http.get('https://www.youtube.com/').subscribe(response => {
				var html = response.text();
				var domParser = new DOMParser();
				var dom = domParser.parseFromString(html, 'text/html');

		  		var channels = this.parser.getChannels(dom)

		  		self.saveChannelsToStorage(channels).then(resolve, reject);
			}, reject);
		});
	}

	saveChannelsToStorage(channels: Channel[]): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.channelService.addOrUpdateChannels(channels)
				.then(resolve, reject);
		});
	}
}
