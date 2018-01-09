import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';

declare var browser: any;
declare var chrome: any;


@Component({
  selector: 'app-debug-page',
  templateUrl: './debug-page.component.html',
  styleUrls: ['./debug-page.component.css']
})
export class DebugPageComponent implements OnInit {
	public localStorage: any;
	public syncStorage: any;
	public syncStorageSize: number;
	public localStorageSize: number;

	constructor(private storageService: StorageService) { }

	ngOnInit() {
		this.updateLocalStorageInfo();
		this.updateSyncStorageInfo();
	}

	updateLocalStorageInfo(): void {
		var self = this;
		function processResult(item) {
			self.localStorage = item;
			self.localStorageSize = JSON.stringify(item).length;
		}
		function processError(error) {
			self.localStorage = error;
			if (error) 
				self.localStorage += error;
		}

        self.storageService.getLocal(null).then(
            processResult, processError
        );
	}

	updateSyncStorageInfo(): void {
		var self = this;
		function processResult(item) {
			self.syncStorage = item;
			self.syncStorageSize = JSON.stringify(item).length;
		}
		function processError(error) {
			self.syncStorage = error;
			if (error) 
				self.syncStorage += error;
		}

		self.storageService.getSync(null).then(
            processResult, processError
        );

		if (typeof browser !== 'undefined') {
            browser.storage.sync.get(null).then(processResult, processError);
        } else {
            chrome.storage.sync.get(null, (item) => {
                if (chrome && chrome.runtime.error)
                    processError(chrome.runtime.error);
                else
                    processResult(item);
            });
        }
	}
}
