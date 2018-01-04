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
		return this.tags.size > 0;
	}

	isNoted(): boolean {
		return this.note.length > 0;
	}

	get hasNewVideos(): boolean {
		return this.newVideosCount > 0;
	}
}