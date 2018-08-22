import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post';
import { Subject } from 'rxjs';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class PostService {
  
  // used for adding/editing/deleting posts, and looking at a subtidder
  private subtidderUrl = 'http://localhost:3000/t';

  private searchPostsUrl = 'http://localhost:3000/search/posts';

  private getPostUrl = 'http://localhost:3000/posts';

  public postToBeDeleted: Post;
  public postToBeEdited: Post;

  public postAdded_Or_Deleted_Observable = new Subject();
  public postEdit_Observable = new Subject();

  public subtidderPosts: Array<any>;

  public subtidderLoaded: boolean = false;
  public subtidderDoesNotExist: boolean = false;

  constructor(private http: HttpClient) { }

  submitPost(post: Post) {
    return this.http.post<any>(`${this.subtidderUrl}/${post.subtidder}/add`, post);
  }

  notifyPostAdditionOrDeletion() {
    this.postAdded_Or_Deleted_Observable.next();
  }

  deletePost() {
    return this.http.delete<any>(`${this.subtidderUrl}/${this.postToBeDeleted.subtidder}/${this.postToBeDeleted.id}`);
  }

  setPostToDelete(post: Post) {
    this.postToBeDeleted = post;
    $('#deletepost')
      .modal({
        transition: 'vertical flip'
      })
      .modal('show');
  }

  editPost(post: Post) {
    return this.http.put<any>(`${this.subtidderUrl}/${this.postToBeEdited.subtidder}/${this.postToBeEdited.id}`, post);
  }

  notifyPostEdition() {
    this.postEdit_Observable.next();
  }

  setPostToEdit(post: Post) {
    this.postToBeEdited = post;
    $('#editpost')
      .modal({
        transition: 'slide down',
        autofocus: false
      })
      .modal('show');
    this.notifyPostEdition();
  }

  searchPosts(searchTerm: string) {
    return this.http.get<any>(this.searchPostsUrl, { params: { s: searchTerm } });
  }

  getPostsFromSubtidder(subtidder: string, page: string) {
    return this.http.get<any>(`${this.subtidderUrl}/${subtidder}`, { params: { page } });
  }

  getPost(id: string) {
    return this.http.get<any>(`${this.getPostUrl}/${id}`);
  }

}
