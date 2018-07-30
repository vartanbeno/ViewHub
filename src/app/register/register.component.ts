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
  @ViewChild('firstNameInput') firstNameInput: ElementRef;
  userData = new User();

  constructor(private authService: AuthService, private router: Router) { }

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
      },
      err => {
        if (err.status === 401) {
          this.usernameTaken = true;
        }
      }
    )
  }

}
