import { Component, OnInit } from '@angular/core';
import { SavingAnimationService } from '../saving-animation.service';


@Component({
  selector: 'app-saving-animation',
  templateUrl: './saving-animation.component.html',
  styleUrls: ['./saving-animation.component.css']
})
export class SavingAnimationComponent implements OnInit {
	private _isVisible: boolean = false;
	// private _disableLater: boolean = false;

	public get animationImagePath(): string {
		return this.savingAnimationService.getImagePath();
	}

	public get isVisible(): boolean {
		return this._isVisible;
	}

	constructor(private savingAnimationService: SavingAnimationService) { }

	ngOnInit() {
		var self = this;

		this.savingAnimationService.runningChanged.subscribe((isRunning) => {
			if (isRunning) {
				self._isVisible = true;
			} else {
				if (self._isVisible)
					setTimeout(() => {
						self._isVisible = false;
						self.savingAnimationService.changeImage();
					}, 800);
			}				
		});
	}

}
