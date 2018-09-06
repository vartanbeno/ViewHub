import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User;
  username: string;

  loggedInUserId: number;
  loggedInUsername: string;

  base64String: string;
  imageSource: string;
  defaultImageSource: string = 'assets/images/default.png';

  pages: number[];
  currentPage: number;
  posts: Post[];

  comments: Comment[];

  userDoesNotExist: boolean = false;
  isOwnProfile: boolean = false;
  profileLoaded: boolean = false;

  editingBio: boolean = false;
  @ViewChild('biographyField') biographyField: ElementRef;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.username = this.route.snapshot.paramMap.get('username');

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.route.queryParams.subscribe(params => this.currentPage = +params.page);
    if (this.currentPage && isNaN(this.currentPage) || this.currentPage < 1) {
      this.router.navigate([`/u/${this.username}`], { queryParams: { page: 1 } });
      return;
    }
    this.currentPage = this.currentPage || 1;
  }

  ngOnInit() {
    this.user = new User();
    this.loggedInUserId = this.authService.getId();
    this.getUserInfo();
    this.postService.postAdded_Or_Deleted_Observable.subscribe(res => this.getUserPosts());
    this.commentService.commentAdded_or_Edited_or_Deleted_Observable.subscribe(res => this.getUserComments());
  }

  getUserInfo() {
    this.userService.getUser(this.username).subscribe(
      res => {
        this.user = res.user;

        // url in browser should at least get correct case representation of username
        if (this.username !== this.user.username) {
          this.router.navigate([`/u/${this.user.username}`], { queryParams: { page: this.currentPage } });
          return;
        }

        this.imageSource = (this.user.image) ? 'data:image/png;base64,' + this.user.image : this.defaultImageSource;

        this.getLoggedInUsername();
      },
      err => {
        console.log(err);
        if (err.status === 404) {
          this.userDoesNotExist = true;
          this.profileLoaded = true;
        }
      }
    )
  }

  updateProfilePicture() {
    this.userService.updateProfilePicture(this.user.username, this.base64String).subscribe(
      res => void 0,
      err => console.log(err)
    )
  }

  setNewProfilePicture(event: Event) {
    let file = event.srcElement['files'][0];

    if (FileReader && file) {
      let fr = new FileReader();

      fr.onload = () => {
        this.imageSource = String(fr.result);
        this.base64String = this.imageSource.split(';')[1].replace('base64,', '');
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
        this.isOwnProfile = (this.loggedInUsername.toLowerCase() === this.user.username.toLowerCase());
        this.getUserPosts();
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

    this.userService.deleteProfilePicture(this.user.username).subscribe(
      res => this.imageSource = 'assets/images/default.png',
      err => console.log(err)
    )
  }

  getUserPosts() {
    this.userService.getUserPosts(this.user.username, this.currentPage.toString()).subscribe(
      res => {
        this.posts = res.posts;

        let numberOfPages = Math.ceil((res.numberOfPosts) / 10);
        this.pages = Array.from(Array(numberOfPages)).map((x, i) => i + 1);

        if (!this.posts.length && this.currentPage != 1) {
          let maxPage = this.pages[this.pages.length - 1];
          this.currentPage = (this.currentPage > maxPage) ? maxPage : 1;
          this.router.navigate([`u/${this.user.username}`], { queryParams: { page: this.currentPage } });
          return;
        }

        this.getUserComments();
      },
      err => console.log(err)
    )
  }

  getUserComments() {
    this.commentService.getUserComments(this.user.username).subscribe(
      res => {
        this.comments = res['comments'];
        this.profileLoaded = true;
      },
      err => console.log(err)
    )
  }

  editingBiography() {
    this.editingBio = true;
    this.user['editedBiography'] = this.user.biography;
    setTimeout(() => this.biographyField.nativeElement.focus());
  }

  editBiography() {
    this.userService.editBiography(this.loggedInUserId, this.user['editedBiography']).subscribe(
      res => {
        this.user.biography = this.user['editedBiography'];
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
