import { Injectable, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from './message.service';


@Injectable()
export class SavingAnimationService {
	@Output()
	runningChanged = new EventEmitter<boolean>();

	images: string[] = [
		"1.gif",
		"2.gif",
		"3.gif",
		"4.gif",
		"5.gif",
		"6.gif",
		"7.gif",
		"8.gif",
		"9.gif",
		"10.gif",
		"11.gif",
		"12.gif",
		"13.gif",
		"14.gif",
		"15.gif",
		"16.gif",
	];

	currentImage: string = "";
	counter: number = 0;

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

	constructor(private messageService: MessageService) {
		this.changeImage();
		// setInterval(() => {
		// 	this.changeImage();
		// }, 3000);
	}


	getImagePath(): string {
		return this.currentImage;
	}

	changeImage(): void {
		var image = this.images[Math.floor(Math.random() * this.images.length)];
		this.currentImage = "/assets/animations/saving/" + image;
	}
}
