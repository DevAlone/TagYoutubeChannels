import { Injectable } from '@angular/core';

declare var browser: any;
declare var chrome: any;


@Injectable()
export class StorageService {

	constructor() {

	}

	getSync(key): Promise<any> {
		return this.get('sync', key);
	}
	getLocal(key): Promise<any> {
		return this.get('local', key);
	}
	setSync(value): Promise<any> {
		return this.set('sync', value);
	}
	setLocal(value): Promise<any> {
		return this.set('local', value);
	}
	removeSync(value): Promise<any> {
		return this.remove('sync', value);
	}
	removeLocal(value): Promise<any> {
		return this.remove('local', value);
	}

	get(storage, key): Promise<any> {
		return this.doStorageAction(storage, 'get', key);
	}
	set(storage, key): Promise<any> {
		return this.doStorageAction(storage, 'set', key);
	}
	remove(storage, key): Promise<any> {
		return this.doStorageAction(storage, 'remove', key);
	}

	doStorageAction(storage, action, key): Promise<any> {
		return new Promise<void>((resolve, reject) => {
			if (typeof browser !== 'undefined') {
                browser.storage[storage][action](key).then(
                    storage => resolve(storage), 
                    error => reject(error)
                );
            } else {
                chrome.storage[storage][action](key, (storage) => {
                    if (chrome && chrome.runtime.error) {
                        reject(chrome.runtime.error);
                        return;
                    }

                    resolve(storage);
                });
            }
		});
	}
}
