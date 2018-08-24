import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostComponent } from './post.component';
import { RouterTestingModule } from '@angular/router/testing';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { DeletePostComponent } from '../delete-post/delete-post.component';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { ListOfCommentsComponent } from '../list-of-comments/list-of-comments.component';
import { LoaderComponent } from '../loader/loader.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PostComponent,
        EditPostComponent,
        DeletePostComponent,
        AddCommentComponent,
        ListOfCommentsComponent,
        LoaderComponent
      ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
