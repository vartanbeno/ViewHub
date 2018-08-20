import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfCommentsComponent } from './list-of-comments.component';

describe('ListOfCommentsComponent', () => {
  let component: ListOfCommentsComponent;
  let fixture: ComponentFixture<ListOfCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
