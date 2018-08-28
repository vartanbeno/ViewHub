import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-users',
  templateUrl: './list-of-users.component.html',
  styleUrls: ['./list-of-users.component.css']
})
export class ListOfUsersComponent implements OnInit {

  users: Array<User>;
  defaultImageSource: string = 'assets/images/default.png';

  listOfUsersLoaded: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      res => {
        this.users = res.users;
        this.users.forEach((user) => {
          user.image = (user.image) ? 'data:image/png;base64,' + user.image : this.defaultImageSource;
        })
        this.listOfUsersLoaded = true;
      },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      }
    )
  }

}
