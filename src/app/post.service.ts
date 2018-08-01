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

  public postAdded_Observable = new Subject();

  constructor(private http: HttpClient) { }

  getPosts() {
    return this.http.get<any>(this.homeUrl);
  }

  submitPost(post: Post) {
    return this.http.post<any>(this.subtidderUrl + post.subtidder + '/add', post);
  }

  notifyPostAddition() {
    this.postAdded_Observable.next();
  }

}
