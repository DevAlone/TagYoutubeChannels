import { Injectable } from '@angular/core';
import { LazyWatcher } from './lazy-watcher';


@Injectable()
export class LazyWatcherService {
	private lastId: number = 0;
	private watchingList: { [key:number]:LazyWatcher } = {};

	constructor() {
		var self = this;

		setInterval(() => {
			for (var watcherId in self.watchingList) {
				var watcher: LazyWatcher = self.watchingList[watcherId];

				if (watcher.wasChanged && !watcher.isChanging) {
					watcher.resetChanged();
					watcher.callback();
				}

				watcher.resetChanging();
			}
		}, 1000);
	}

	getWatcher(callback: Function): LazyWatcher {
		++this.lastId;
		var watcher = new LazyWatcher(callback);
		this.watchingList[this.lastId] = watcher;
		return watcher;
	}
}
