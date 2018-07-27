import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from '../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usernameTaken: boolean = false;
  @ViewChild('usernameInput') usernameInput: ElementRef;
  userData = new User('', '');

  constructor() { }

  ngOnInit() {
    this.usernameInput.nativeElement.focus();
  }

  registerUser() {
    console.log(this.userData);
  }

}
