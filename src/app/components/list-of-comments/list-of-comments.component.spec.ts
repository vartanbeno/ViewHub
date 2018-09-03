import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfCommentsComponent } from './list-of-comments.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Comment } from '../../models/comment';

fdescribe('ListOfCommentsComponent', () => {
  let component: ListOfCommentsComponent;
  let fixture: ComponentFixture<ListOfCommentsComponent>;

  let debugElement: DebugElement;
  let debugElements: DebugElement[];

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
    component.post_id = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should display 'There seems to be nothing here...' if there are no comments`, () => {
    component.comments = [];
    component.commentsLoaded = true;
    fixture.detectChanges();

    debugElement = fixture.debugElement.query(By.css('.no.comments'));
    expect(debugElement.nativeElement.textContent).toEqual('There seems to be nothing here...');
  })

  it('should display comments and not the empty message if the post has comments', () => {
    component.comments = [firstComment, secondComment];
    component.commentsLoaded = true;
    fixture.detectChanges();

    debugElement = fixture.debugElement.query(By.css('.no.comments'));
    expect(debugElement).toBeNull();

    debugElements = fixture.debugElement.queryAll(By.css('.comment'));
    expect(debugElements.length).toEqual(component.comments.length);
  })

  describe('comment', () => {

    beforeEach(() => {
      login();
      component.comments = [firstComment, secondComment];
      component.commentsLoaded = true;
      fixture.detectChanges();
      debugElements = fixture.debugElement.queryAll(By.css('.comment'));
    })

    it(`should show edit and delete options if it's the logged in user's comment`, () => {
      expect(debugElements.length).toEqual(component.comments.length);
      expect(debugElements[0].query(By.css('.actions'))).toBeTruthy();
      expect(debugElements[1].query(By.css('.actions'))).toBeNull();
    })

    it(`should show a form with a textarea and save/cancel buttons if it's in editing mode`, () => {
      expect(debugElements[0].query(By.css('form'))).toBeNull();

      firstComment['editing'] = true;
      fixture.detectChanges();
      expect(debugElements[0].query(By.css('form'))).toBeTruthy();
    })

    afterEach(() => {
      logout();
    })

  })
});

let firstComment = new Comment();
firstComment.author = 'test-author';
firstComment.author_id = 1;
firstComment.body = 'test-comment';
firstComment.pub_date = new Date().toDateString();

let secondComment = new Comment();
secondComment.author = 'test-author-2';
secondComment.author_id = 2;
secondComment.body = 'test-comment-2';
secondComment.pub_date = new Date().toDateString();

function login() {
  localStorage.setItem('token', 'token');
  localStorage.setItem('name', 'test');
  localStorage.setItem('id', '1');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  localStorage.removeItem('id');
}
