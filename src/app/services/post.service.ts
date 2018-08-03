import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private homeUrl = 'http://localhost:3000/t/all';
  private subtidderUrl = 'http://localhost:3000/posts/add/';
  private countPostsUrl = 'http://localhost:3000/countPosts/';
  private deletePostUrl = 'http://localhost:3000/delete/';
  private editPostUrl = 'http://localhost:3000/edit/';

  private searchPostsUrl = 'http://localhost:3000/search/posts/';

  public postToBeDeleted: Post;
  public postToBeEdited: Post;

  public postAdded_Observable = new Subject();
  public postDelete_Observable = new Subject();
  public postEdit_Observable = new Subject();

  constructor(private http: HttpClient) { }

  getPosts(offset: string) {
    return this.http.get<any>(this.homeUrl, { params: { offset: offset } });
  }

  submitPost(post: Post) {
    return this.http.post<any>(this.subtidderUrl, post);
  }

  notifyPostAddition() {
    this.postAdded_Observable.next();
  }

  countPosts() {
    return this.http.get<any>(this.countPostsUrl);
  }

  deletePost() {
    return this.http.delete<any>(`${this.deletePostUrl}${this.postToBeDeleted.id}`);
  }

  setPostToDelete(post: Post) {
    this.postToBeDeleted = post;
  }

  notifyPostDeletion() {
    this.postDelete_Observable.next();
  }

  editPost(post: Post) {
    return this.http.post<any>(`${this.editPostUrl}${this.postToBeEdited.id}`, post);
  }

  notifyPostEdition() {
    this.postEdit_Observable.next();
  }

  setPostToEdit(post: Post) {
    this.postToBeEdited = post;
    this.notifyPostEdition();
  }

  searchPosts(searchTerm: string) {
    return this.http.get<any>(this.searchPostsUrl, { params: { s: searchTerm } });
  }

}
