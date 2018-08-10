import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usernameTaken: boolean = false;
  @ViewChild('firstNameInput') firstNameInput: ElementRef;
  userData = new User();

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.firstNameInput.nativeElement.focus();
  }

  registerUser() {
    this.authService.registerUser(this.userData).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('id', res.id);
        localStorage.setItem('name', res.fullname);
        this.router.navigate(['']);
        this.userService.notifyLoginOrSignup();
      },
      err => {
        if (err.status === 401) {
          this.usernameTaken = true;
        }
      }
    )
  }

}
