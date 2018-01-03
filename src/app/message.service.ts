import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {
	messages: string[] = [];
	lastMessage: string = "";
	private messagesLimit: number = 10;
	
	constructor() { }

	addMessage(message: string): void {
		var self = this;
		this.messages.push(message);
		if (this.messages.length > this.messagesLimit)
			this.messages.splice(0, this.messages.length - this.messagesLimit);
		this.lastMessage = message;
		setTimeout(function() {
			self.messages.splice(0, 1);
			if (self.messages.length == 0)
				self.lastMessage = "";
		}, 2000);
	}
}
