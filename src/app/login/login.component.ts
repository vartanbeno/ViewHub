import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  badCredentials: boolean = false;
  @ViewChild('usernameInput') usernameInput: ElementRef;
  userData = new User('', '');

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.usernameInput.nativeElement.focus();
  }

  loginUser() {
    this.authService.loginUser(this.userData).subscribe(
      res => console.log(res),
      err => {
        if (err.status === 401) {
          this.badCredentials = true;
        }
      }
    )
  }

}
