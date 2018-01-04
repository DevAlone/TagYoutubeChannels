import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelTagsComponent } from './channel-tags.component';

describe('ChannelTagsComponent', () => {
  let component: ChannelTagsComponent;
  let fixture: ComponentFixture<ChannelTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
