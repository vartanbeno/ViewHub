import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private homeUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  getPosts() {
    return this.http.get<any>(this.homeUrl);
  }

}
