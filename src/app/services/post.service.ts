import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  
  private addPostUrl = 'http://localhost:3000/posts/add/';
  private deletePostUrl = 'http://localhost:3000/posts/delete/';
  private editPostUrl = 'http://localhost:3000/posts/edit/';
  private countPostsUrl = 'http://localhost:3000/posts/count/';

  private allSubtiddersUrl = 'http://localhost:3000/t/all';
  private subtidderUrl = 'http://localhost:3000/t/';

  private searchPostsUrl = 'http://localhost:3000/search/posts/';

  public postToBeDeleted: Post;
  public postToBeEdited: Post;

  public postAdded_Observable = new Subject();
  public postDelete_Observable = new Subject();
  public postEdit_Observable = new Subject();

  public allPosts: Array<any>;
  public subtidderPosts: Array<any>;

  public homeLoaded = false;
  public subtidderLoaded = false;

  constructor(private http: HttpClient) { }

  getPosts(offset: string) {
    return this.http.get<any>(this.allSubtiddersUrl, { params: { offset: offset } });
  }

  submitPost(post: Post) {
    return this.http.post<any>(this.addPostUrl, post);
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
    return this.http.post<any>(this.editPostUrl, post);
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

  getPostsFromSubtidder(subtidder: string, offset: string) {
    return this.http.get<any>(`${this.subtidderUrl}${subtidder}`, { params: { offset: offset } });
  }

  countPostsFromSubtidder(subtidder: string) {
    return this.http.get<any>(`${this.subtidderUrl}${subtidder}/count`);
  }

}
