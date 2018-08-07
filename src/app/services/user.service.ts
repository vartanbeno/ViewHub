import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private allUsersUrl = 'http://localhost:3000/users/all';
  private userUrl = 'http://localhost:3000/users/u/';
  private usernameUrl = 'http://localhost:3000/users/u/id/';

  public username_Observable = new Subject();

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get<any>(this.allUsersUrl);
  }

  getUser(username: string) {
    return this.http.get<any>(`${this.userUrl}${username}`);
  }

  getUsername(id: string) {
    return this.http.get<any>(`${this.usernameUrl}${id}`);
  }

  updateUsername() {
    this.username_Observable.next();
  }

  updateProfilePicture(username: string, base64String: string) {
    return this.http.post<any>(`${this.userUrl}${username}/pic`, { base64: base64String });
  }

}
