import { Tag } from './tag';

declare var chrome: any;


export class Channel {
	id: string = "";
	title: string = "";
	iconUrl: string = "";
	newVideosCount: number = 0;
	inSubscriptions: boolean = false;
	private _note: string;
	tags: Set<Tag> = new Set<Tag>();

	public get noteMaxLength(): number {
		return 1024;
	}

	get note(): string {
		if (!this._note)
			this._note = "";

		return this._note;
	}

	set note(value: string) { 
		this._note = value; 
		this._note = this._note.substr(0, this.noteMaxLength);
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