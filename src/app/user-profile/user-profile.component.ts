import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user = {};
  username: string;

  base64String: string;
  imageSource: string;

  userDoesNotExist: boolean = false;
  isLoaded: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer
  ) {
    this.username = this.route.snapshot.paramMap.get('username');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.userService.getUser(this.username).subscribe(
      res => {
        this.user = res.user;
        this.imageSource = (this.user['base64']) ? 'data:image/png;base64,' + this.user['base64'] : 'assets/images/default.png';
        this.isLoaded = true;
      },
      err => {
        console.log(err);
        if (err.status === 404) {
          this.userDoesNotExist = true;
          this.isLoaded = true;
        }
      }
    )
  }

  updateProfilePicture() {
    this.userService.updateProfilePicture(this.username, this.base64String).subscribe(
      res => console.log(res),
      err => console.log(err)
    )
  }

  setNewProfilePicture(event: Event) {
    let file = event.srcElement['files'][0];

    if (FileReader && file) {
      let fr = new FileReader();

      fr.onload = () => {
        this.imageSource = fr.result;
        this.base64String = fr.result.split(';')[1].replace('base64,', '');
        this.updateProfilePicture();
      }

      fr.readAsDataURL(file);
    }
  }

}
