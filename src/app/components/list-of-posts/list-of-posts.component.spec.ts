import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfPostsComponent } from './list-of-posts.component';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { DeletePostComponent } from '../delete-post/delete-post.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

describe('ListOfPostsComponent', () => {
  let component: ListOfPostsComponent;
  let fixture: ComponentFixture<ListOfPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListOfPostsComponent,
        EditPostComponent,
        DeletePostComponent
      ],
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
