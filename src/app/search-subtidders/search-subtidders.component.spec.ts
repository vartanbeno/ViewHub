import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSubtiddersComponent } from './search-subtidders.component';

describe('SearchSubtiddersComponent', () => {
  let component: SearchSubtiddersComponent;
  let fixture: ComponentFixture<SearchSubtiddersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSubtiddersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSubtiddersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
