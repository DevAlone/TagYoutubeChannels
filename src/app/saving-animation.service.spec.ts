import { TestBed, inject } from '@angular/core/testing';

import { SavingAnimationService } from './saving-animation.service';

describe('SavingAnimationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SavingAnimationService]
    });
  });

  it('should be created', inject([SavingAnimationService], (service: SavingAnimationService) => {
    expect(service).toBeTruthy();
  }));
});
