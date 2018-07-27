import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerUrl = 'http://localhost:3000/register';

  constructor(private http: HttpClient) { }

  registerUser(user: User) {
    return this.http.post<any>(this.registerUrl, user);
  }
  
}
