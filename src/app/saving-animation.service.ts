import { Injectable, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from './message.service';


@Injectable()
export class SavingAnimationService {
	@Output()
	runningChanged = new EventEmitter<boolean>();

	private IMAGES_COUNT: number = 19;
	images: string[] = [];

	currentImage: string = "";
	counter: number = 0;

	constructor(private messageService: MessageService) {
		for (var i = 0; i < this.IMAGES_COUNT; ++i) 
			this.images.push((i + 1) + '.gif');
		
		this.changeImage();
	}

	get isRunning(): boolean {
		return this.counter > 0;
	}
	
	startSaving(): void {
		if (this.counter == 0) {
			this.runningChanged.emit(true);
		}

		++this.counter;
	}

	stopSaving(): void {
		if (this.counter == 1) {
			this.runningChanged.emit(false);
			// this.changeImage();
		}
		
		--this.counter;
		if (this.counter < 0) 
			this.counter = 0;

		// if (!this.counter)
		// 	this.messageService.addMessage("saved succesfully");
	}

	getImagePath(): string {
		return this.currentImage;
	}

	changeImage(): void {
		var image = this.images[Math.floor(Math.random() * this.images.length)];
		this.currentImage = "/assets/animations/saving/" + image;
	}
}
