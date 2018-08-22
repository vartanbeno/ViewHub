import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../models/comment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private commentsUrl = 'http://localhost:3000/comments';

  commentAdded_or_Deleted_Observable = new Subject();

  constructor(private http: HttpClient) { }

  getPostComments(post_id: string) {
    return this.http.get<any>(`${this.commentsUrl}/${post_id}`);
  }

  addComment(comment: Comment) {
    return this.http.put<any>(this.commentsUrl, comment);
  }

  editComment(comment_id: string, body: string) {
    return this.http.post<any>(`${this.commentsUrl}/${comment_id}`, { body: body });
  }

  deleteComment(comment_id: string) {
    return this.http.delete<any>(`${this.commentsUrl}/${comment_id}`);
  }

  notifyCommentAdditionOrDeletion() {
    this.commentAdded_or_Deleted_Observable.next();
  }

}
