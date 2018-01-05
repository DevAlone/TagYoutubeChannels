import { Tag } from './tag';


export class Channel {
	id: string;
	title: string;
	iconUrl: string;
	newVideosCount: number;
	inSubscriptions: boolean;
	note: string;
	tags: Set<Tag> = new Set<Tag>();

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