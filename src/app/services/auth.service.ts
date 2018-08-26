import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerUrl = 'http://localhost:3000/authenticate/register';
  private loginUrl = 'http://localhost:3000/authenticate/login';

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  registerUser(user: User): Observable<any> {
    return this.http.post<any>(this.registerUrl, user);
  }

  loginUser(user: User): Observable<any> {
    return this.http.post<any>(this.loginUrl, user);
  }

  loggedIn(): boolean {
    return !!(this.getToken() && this.getName() && this.getId());
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  setId(id: string): void {
    localStorage.setItem('id', id);
  }

  setName(name: string): void {
    localStorage.setItem('name', name);
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  getId(): number {
    return +localStorage.getItem('id');
  }

  getName(): string {
    return localStorage.getItem('name');
  }

  logoutUser(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    this.router.navigate(['']);
  }
  
}
