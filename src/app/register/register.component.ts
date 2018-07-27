import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usernameTaken: boolean = false;
  @ViewChild('usernameInput') usernameInput: ElementRef;
  userData = new User('', '');

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.usernameInput.nativeElement.focus();
  }

  registerUser() {
    this.authService.registerUser(this.userData).subscribe(
      res => console.log(res),
      err => {
        if (err.status === 401) {
          this.usernameTaken = true;
        }
      }
    )
  }

}
