import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'http://localhost:3000/users/all';

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any>(this.usersUrl);
  }

}
