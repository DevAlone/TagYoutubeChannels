import { TestBed, inject } from '@angular/core/testing';

import { ChannelTagRelationService } from './channel-tag-relation.service';

describe('ChannelTagRelationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelTagRelationService]
    });
  });

  it('should be created', inject([ChannelTagRelationService], (service: ChannelTagRelationService) => {
    expect(service).toBeTruthy();
  }));
});
