import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private allUsersUrl = 'http://localhost:3000/users/all';
  private userUrl = 'http://localhost:3000/users/u';
  private usernameUrl = 'http://localhost:3000/users/u/id';

  private subscriptionsUrl = 'http://localhost:3000/subscriptions';

  public authentication_Observable = new Subject();
  public subscriptionsList_Observable = new Subject();
  public subscriptionsFetch_Observable = new Subject();
  
  public noSubscriptions: boolean;

  constructor(private http: HttpClient) { }

  getPostsFromSubscriptions(user_id: number, page: string) {
    return this.http.get<any>(`${this.subscriptionsUrl}/${user_id}/posts`, { params: { page } });
  }

  getAllUsers() {
    return this.http.get<any>(this.allUsersUrl);
  }

  getUser(username: string) {
    return this.http.get<any>(`${this.userUrl}/${username}`);
  }

  getSubscriptions(user_id: number) {
    return this.http.get<any>(`${this.subscriptionsUrl}/${user_id}`);
  }

  refreshSubscriptions() {
    this.subscriptionsList_Observable.next();
  }

  notifyFetchedSubscriptions() {
    this.subscriptionsFetch_Observable.next();
  }

  getUsername(user_id: number) {
    return this.http.get<any>(`${this.usernameUrl}/${user_id}`);
  }

  updateProfilePicture(username: string, base64String: string) {
    return this.http.put<any>(`${this.userUrl}/${username}/pic`, { base64: base64String });
  }

  deleteProfilePicture(username: string) {
    return this.http.delete<any>(`${this.userUrl}/${username}/pic`);
  }

  getUserPosts(username: string, page: string) {
    return this.http.get<any>(`${this.userUrl}/${username}/posts`, { params: { page } });
  }

  notifyLoginOrSignup() {
    this.authentication_Observable.next();
  }

  checkIfSubscribed(user_id: number, subtidder: string) {
    return this.http.get<any>(`${this.subscriptionsUrl}/${user_id}/${subtidder}`);
  }

  subscribe(user_id: number, subtidder: string) {
    return this.http.post<any>(`${this.subscriptionsUrl}/${user_id}/${subtidder}`, null);
  }

  unsubscribe(user_id: number, subtidder: string) {
    return this.http.delete<any>(`${this.subscriptionsUrl}/${user_id}/${subtidder}`);
  }

  editBiography(user_id: number, biography: string) {
    return this.http.put<any>(`${this.userUrl}/${user_id}/bio`, { biography: biography });
  }

}
