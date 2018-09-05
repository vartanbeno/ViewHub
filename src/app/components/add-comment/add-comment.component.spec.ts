import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommentComponent } from './add-comment.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AddCommentComponent', () => {
  let component: AddCommentComponent;
  let fixture: ComponentFixture<AddCommentComponent>;

  let submitButton: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCommentComponent ],
      imports: [
        FormsModule,
        HttpClientModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    submitButton = fixture.debugElement.query(By.css('button[type=submit]'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the addComment method when the submit button is clicked', () => {
    component.comment.body = 'test comment';
    fixture.detectChanges();

    spyOn(component, 'addComment');
    submitButton.nativeElement.click();

    fixture.whenStable().then(() => {
      expect(component.addComment).toHaveBeenCalled();
    })
  })
});
