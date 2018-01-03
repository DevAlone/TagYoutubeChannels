import { Channel } from './channel';


export class Tag {
	id: number;
	name: string;
	channels: Set<Channel> = new Set<Channel>();

	public constructor(init?:Partial<Tag>) {
		Object.assign(this, init);
	}
}