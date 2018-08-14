import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubtidderComponent } from './create-subtidder.component';

describe('CreateSubtidderComponent', () => {
  let component: CreateSubtidderComponent;
  let fixture: ComponentFixture<CreateSubtidderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSubtidderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSubtidderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
