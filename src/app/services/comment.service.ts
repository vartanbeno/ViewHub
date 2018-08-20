import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private commentsUrl = 'http://localhost:3000/comments';

  constructor(private http: HttpClient) { }

  getPostComments(id: string) {
    return this.http.get<any>(`${this.commentsUrl}/${id}`);
  }

}
