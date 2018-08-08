import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SubtidderService } from '../services/subtidder.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  badCredentials: boolean = false;
  @ViewChild('usernameInput') usernameInput: ElementRef;
  userData = new User();

  constructor(
    private authService: AuthService,
    private router: Router,
    private subtidderService: SubtidderService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.usernameInput.nativeElement.focus();
  }

  loginUser() {
    this.authService.loginUser(this.userData).subscribe(
      res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('id', res.id);
        localStorage.setItem('name', res.fullname);
        this.subtidderService.updateSubscriptions();
        this.userService.updateUsername();
        this.router.navigate(['']);
      },
      err => {
        console.log(err)
        if (err.status === 401) {
          this.badCredentials = true;
        }
      }
    )
  }

}
