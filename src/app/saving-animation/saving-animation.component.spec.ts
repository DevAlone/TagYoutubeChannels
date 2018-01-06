import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingAnimationComponent } from './saving-animation.component';

describe('SavingAnimationComponent', () => {
  let component: SavingAnimationComponent;
  let fixture: ComponentFixture<SavingAnimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavingAnimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
