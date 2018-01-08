import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchOnYoutubeLinkComponent } from './watch-on-youtube-link.component';

describe('WatchOnYoutubeLinkComponent', () => {
  let component: WatchOnYoutubeLinkComponent;
  let fixture: ComponentFixture<WatchOnYoutubeLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchOnYoutubeLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchOnYoutubeLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
