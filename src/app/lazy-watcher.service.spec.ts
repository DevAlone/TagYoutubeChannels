import { TestBed, inject } from '@angular/core/testing';

import { LazyWatcherService } from './lazy-watcher.service';

describe('LazyWatcherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LazyWatcherService]
    });
  });

  it('should be created', inject([LazyWatcherService], (service: LazyWatcherService) => {
    expect(service).toBeTruthy();
  }));
});
