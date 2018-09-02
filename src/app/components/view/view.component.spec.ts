import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComponent } from './view.component';
import { AddPostComponent } from '../add-post/add-post.component';
import { ListOfPostsComponent } from '../list-of-posts/list-of-posts.component';
import { LoaderComponent } from '../loader/loader.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { DeletePostComponent } from '../delete-post/delete-post.component';
import { HttpClientModule } from '@angular/common/http';

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewComponent,
        AddPostComponent,
        ListOfPostsComponent,
        LoaderComponent,
        ErrorMessageComponent,
        EditPostComponent,
        DeletePostComponent
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
    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    component.view = 'nba';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
