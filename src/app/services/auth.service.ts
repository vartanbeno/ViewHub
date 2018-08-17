import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerUrl = 'http://localhost:3000/authenticate/register';
  private loginUrl = 'http://localhost:3000/authenticate/login';

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(user: User) {
    return this.http.post<any>(this.registerUrl, user);
  }

  loginUser(user: User) {
    return this.http.post<any>(this.loginUrl, user);
  }

  loggedIn() {
    return !!(localStorage.getItem('token') && localStorage.getItem('name') && localStorage.getItem('id'));
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  setId(id: string) {
    localStorage.setItem('id', id);
  }

  setName(name: string) {
    localStorage.setItem('name', name);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getId() {
    return localStorage.getItem('id');
  }

  getName() {
    return localStorage.getItem('name');
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    this.router.navigate(['/t/all']);
  }
  
}
