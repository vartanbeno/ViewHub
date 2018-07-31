import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private homeUrl = 'http://localhost:3000/';
  private submitPostUrl = 'http://localhost:3000/t/nba/add';

  constructor(private http: HttpClient) { }

  getPosts() {
    return this.http.get<any>(this.homeUrl);
  }

  submitPost(post: Post) {
    return this.http.post<any>(this.submitPostUrl, post);
  }

}
