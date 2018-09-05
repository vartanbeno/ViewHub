import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../models/comment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private commentsUrl = 'http://localhost:3000/comments';
  private userUrl = 'http://localhost:3000/users/u';

  commentAdded_or_Edited_or_Deleted_Observable = new Subject();

  constructor(private http: HttpClient) { }

  getPostComments(post_id: number) {
    return this.http.get<any>(`${this.commentsUrl}/${post_id}`);
  }

  addComment(comment: Comment) {
    return this.http.post<any>(this.commentsUrl, comment);
  }

  editComment(comment_id: number, body: string) {
    return this.http.put<any>(`${this.commentsUrl}/${comment_id}`, { body: body });
  }

  deleteComment(comment_id: number) {
    return this.http.delete<any>(`${this.commentsUrl}/${comment_id}`);
  }

  notifyCommentAdditionOrEditionOrDeletion() {
    this.commentAdded_or_Edited_or_Deleted_Observable.next();
  }

  getUserComments(username: string) {
    return this.http.get<Comment[]>(`${this.userUrl}/${username}/comments`);
  }

}
