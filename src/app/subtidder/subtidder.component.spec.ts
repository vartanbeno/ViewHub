import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtidderComponent } from './subtidder.component';

describe('SubtidderComponent', () => {
  let component: SubtidderComponent;
  let fixture: ComponentFixture<SubtidderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtidderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtidderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
