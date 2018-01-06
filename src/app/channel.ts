import { Tag } from './tag';

declare var chrome: any;


export class Channel {
	id: string;
	title: string;
	iconUrl: string;
	newVideosCount: number;
	inSubscriptions: boolean;
	_note: string;
	tags: Set<Tag> = new Set<Tag>();

	get note(): string {
		if (!this._note)
			this._note = "";

		return this._note;
	}

	set note(value: string) {
		this._note = value;
		// if (typeof chrome !== 'undefined')
		// 	this._note = this._note.substr(0, 4096);
	}

	public constructor(init?:Partial<Channel>) {
        Object.assign(this, init);
    }

	isTagged(): boolean {
		if (!this.tags)
			return false;

		return this.tags.size > 0;
	}

	isNoted(): boolean {
		if (!this.note)
			return false;

		return this.note.length > 0;
	}

	get hasNewVideos(): boolean {
		if (!this.newVideosCount)
			return false;

		return this.newVideosCount > 0;
	}

	get url(): string {
		return "https://www.youtube.com/channel/" + this.id + "/videos?disable_polymer=1";
	}
}