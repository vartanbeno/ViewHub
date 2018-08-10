import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostToSubtidderComponent } from './add-post-to-subtidder.component';

describe('AddPostToSubtidderComponent', () => {
  let component: AddPostToSubtidderComponent;
  let fixture: ComponentFixture<AddPostToSubtidderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPostToSubtidderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPostToSubtidderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
