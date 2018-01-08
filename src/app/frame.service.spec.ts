import { TestBed, inject } from '@angular/core/testing';

import { FrameService } from './frame.service';

describe('FrameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FrameService]
    });
  });

  it('should be created', inject([FrameService], (service: FrameService) => {
    expect(service).toBeTruthy();
  }));
});
