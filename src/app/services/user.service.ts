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

  public userPosts: Array<any>;
  public subscriptionsPosts: Array<any>;
  
  public profileLoaded: boolean = false;
  public listOfUsersLoaded: boolean = false;
  public homeLoaded: boolean = false;
  public noSubscriptions: boolean;

  constructor(private http: HttpClient) { }

  getPostsFromSubscriptions(id: string, page: string) {
    return this.http.get<any>(`${this.subscriptionsUrl}/${id}/posts`, { params: { page } });
  }

  getAllUsers() {
    return this.http.get<any>(this.allUsersUrl);
  }

  getUser(username: string) {
    return this.http.get<any>(`${this.userUrl}/${username}`);
  }

  getSubscriptions(id: string) {
    return this.http.get<any>(`${this.subscriptionsUrl}/${id}`);
  }

  refreshSubscriptions() {
    this.subscriptionsList_Observable.next();
  }

  notifyFetchedSubscriptions() {
    this.subscriptionsFetch_Observable.next();
  }

  getUsername(id: string) {
    return this.http.get<any>(`${this.usernameUrl}/${id}`);
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

  checkIfSubscribed(id: string, subtidder: string) {
    return this.http.get<any>(`${this.subscriptionsUrl}/${id}/${subtidder}`);
  }

  subscribe(id: string, subtidder: string) {
    return this.http.post<any>(`${this.subscriptionsUrl}/${id}/${subtidder}`, null);
  }

  unsubscribe(id: string, subtidder: string) {
    return this.http.delete<any>(`${this.subscriptionsUrl}/${id}/${subtidder}`);
  }

}
