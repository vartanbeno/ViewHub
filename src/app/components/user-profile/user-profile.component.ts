import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user = {};
  username: string;
  loggedInUserId: string;
  loggedInUsername: string;

  base64String: string;
  imageSource: string;
  defaultImageSource: string = 'assets/images/default.png';

  pages: Array<number> = [];
  currentPage: number;

  userDoesNotExist: boolean = false;
  isOwnProfile = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.username = this.route.snapshot.paramMap.get('username');
  }

  ngOnInit() {
    this.userService.profileLoaded = false;
    this.getUserInfo();
    this.getLoggedInUsername();
  }

  getUserInfo() {
    this.userService.getUser(this.username).subscribe(
      res => {
        this.user = res.user;
        this.imageSource = (this.user['base64']) ? 'data:image/png;base64,' + this.user['base64'] : this.defaultImageSource;
      },
      err => {
        console.log(err);
        if (err.status === 404) {
          this.userDoesNotExist = true;
          this.userService.profileLoaded = true;
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

    event.target['value'] = '';
  }

  getLoggedInUsername() {
    this.loggedInUserId = localStorage.getItem('id');
    this.userService.getUsername(this.loggedInUserId).subscribe(
      res => {
        this.loggedInUsername = res;
        if (this.loggedInUsername === this.username) {
          this.isOwnProfile = true;
        }
      },
      err => console.log(err)
    )
  }

  deleteProfilePicture() {
    if (this.imageSource === this.defaultImageSource) {
      alert('You do not have a profile picture set.');
      return;
    }

    let confirmDelete = confirm('Are you sure you want to delete your profile picture?');
    if (!confirmDelete) return;

    this.userService.deleteProfilePicture(this.username).subscribe(
      res => {
        console.log(res);
        this.imageSource = 'assets/images/default.png';
      },
      err => console.log(err)
    )
  }

}
