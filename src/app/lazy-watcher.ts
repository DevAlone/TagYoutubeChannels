export class LazyWatcher {
	private _callback: Function;
	private _wasChanged: boolean = false;
	private _isChanging: boolean = false;
	
	public get wasChanged(): boolean {
		return this._wasChanged;
	}
	public get isChanging(): boolean {
		return this._isChanging;
	}

	public get callback(): Function {
		return this._callback;
	}

	constructor(callback: Function) {
		this._callback = callback;
	}
	
	setChanging(): void {
		this._wasChanged = true;
		this._isChanging = true;
	}

	resetChanged(): void {
		this._wasChanged = false;
	}
	resetChanging(): void {
		this._isChanging = false;
	}
};