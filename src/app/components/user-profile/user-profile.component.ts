import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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

  editingBio: boolean = false;
  @ViewChild('biographyField') biographyField: ElementRef;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.username = this.route.snapshot.paramMap.get('username');
  }

  ngOnInit() {
    this.userService.profileLoaded = false;
    this.loggedInUserId = this.authService.getId();
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
    this.userService.getUsername(this.loggedInUserId).subscribe(
      res => {
        this.loggedInUsername = res.username;
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

  editingBiography() {
    this.editingBio = true;
    this.user['editedBiography'] = this.user['biography'];
    setTimeout(() => this.biographyField.nativeElement.focus());
  }

  editBiography() {
    this.userService.editBiography(this.loggedInUserId, this.user['editedBiography']).subscribe(
      res => {
        this.user['biography'] = this.user['editedBiography'];
        this.editingBio = false;
      },
      err => console.log(err)
    )
  }

  clearBiography() {
    let confirmClearBiography = confirm('Click OK to clear your biography.');

    if (confirmClearBiography) {
      this.user['editedBiography'] = null;
      this.editBiography();
    }
  }

}
