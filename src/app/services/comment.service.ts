import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../models/comment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private commentsUrl = 'http://localhost:3000/comments';

  commentAdded_Observable = new Subject();

  constructor(private http: HttpClient) { }

  getPostComments(id: string) {
    return this.http.get<any>(`${this.commentsUrl}/${id}`);
  }

  addComment(comment: Comment) {
    return this.http.put<any>(this.commentsUrl, comment);
  }

  notifyCommentAddition() {
    this.commentAdded_Observable.next();
  }

}
