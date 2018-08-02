import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './models/post';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private homeUrl = 'http://localhost:3000/';
  private subtidderUrl = 'http://localhost:3000/t/';
  private countPostsUrl = 'http://localhost:3000/countPosts/';
  private deletePostUrl = 'http://localhost:3000/delete/';

  public postToBeDeleted: Post;

  public postAdded_Observable = new Subject();
  public postDelete_Observable = new Subject();

  constructor(private http: HttpClient) { }

  getPosts(offset: string) {
    return this.http.get<any>(this.homeUrl, { params: { offset: offset } });
  }

  submitPost(post: Post) {
    return this.http.post<any>(`${this.subtidderUrl}${post.subtidder}/add`, post);
  }

  notifyPostAddition() {
    this.postAdded_Observable.next();
  }

  countPosts() {
    return this.http.get<any>(this.countPostsUrl);
  }

  deletePost() {
    return this.http.delete<any>(`${this.deletePostUrl}${this.postToBeDeleted.id}`)
  }

  setPostToDelete(post: Post) {
    this.postToBeDeleted = post;
  }

  unsetPostToDelete() {
    this.postToBeDeleted = null;
  }

  notifyPostDeletion() {
    this.postDelete_Observable.next();
  }

}
