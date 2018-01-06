export class ChannelFilterObject {
	searchString: string = "";
	inSubscriptions: boolean = false;
	hasNewVideos: boolean = false;
	isNoted: boolean = false;
	isTagged: boolean = false;
	isNotTagged: boolean = false;
	private _tagsSearchString: string = "";
	public _tags: string[] = [];
	tagsStrictMode: boolean = true;


	get tagsSearchString(): string {
		return this._tagsSearchString;
	}

	set tagsSearchString(value: string) {
		this._tagsSearchString = value;

		this._tags = 
			this._tagsSearchString.split(',')
				.map(item => item = item.toLowerCase().trim())
				.filter(item => item && item.length && (item[0] === '-' ? item.length > 1 : true) );
	}
};
