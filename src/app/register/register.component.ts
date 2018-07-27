import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usernameTaken: boolean = false;
  @ViewChild('usernameInput') usernameInput: ElementRef;
  userData = new User('', '');

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.usernameInput.nativeElement.focus();
  }

  registerUser() {
    this.authService.registerUser(this.userData).subscribe(
      res => {
        this.router.navigate(['']);
      },
      err => {
        if (err.status === 401) {
          this.usernameTaken = true;
        }
      }
    )
  }

}
