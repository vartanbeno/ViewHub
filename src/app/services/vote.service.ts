import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  private voteUrl = 'http://localhost:3000/votes';

  public votes_Observable = new Subject();

  constructor(private http: HttpClient) { }

  // returns post id's
  getUpvotedPosts(user_id: number) {
    return this.http.get<number>(`${this.voteUrl}/${user_id}/up`);
  }

  getDownvotedPosts(user_id: number) {
    return this.http.get<number>(`${this.voteUrl}/${user_id}/down`);
  }

  upvotePost(post_id: number, user_id: number) {
    return this.http.post(`${this.voteUrl}/${post_id}/${user_id}/up`, { });
  }

  downvotePost(post_id: number, user_id: number) {
    return this.http.post(`${this.voteUrl}/${post_id}/${user_id}/down`, { });
  }

  removeVote(post_id: number, user_id: number) {
    return this.http.delete(`${this.voteUrl}/${post_id}/${user_id}`);
  }

  notifyVotes() {
    this.votes_Observable.next();
  }

}
