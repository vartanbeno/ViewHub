import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfCommentsComponent } from './list-of-comments.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

fdescribe('ListOfCommentsComponent', () => {
  let component: ListOfCommentsComponent;
  let fixture: ComponentFixture<ListOfCommentsComponent>;

  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfCommentsComponent ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientModule
      ]
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

  it(`should display 'There seems to be nothing here...' if there are no comments`, () => {
    component.noComments = true;
    fixture.detectChanges();

    debugElement = fixture.debugElement.query(By.css('.no.comments'));
    expect(debugElement.nativeElement.textContent).toEqual('There seems to be nothing here...');
  })
});
