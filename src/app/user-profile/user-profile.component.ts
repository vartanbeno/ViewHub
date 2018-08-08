import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post.service';
import { Post } from '../models/post';
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

  posts: Array<any> = [];
  pages: Array<number> = [];
  currentPage: number;

  userDoesNotExist: boolean = false;
  isLoaded: boolean = false;
  isOwnProfile = false;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.username = this.route.snapshot.paramMap.get('username');
    this.route.queryParams.subscribe(params => this.currentPage = params.page);
    this.currentPage = (!this.currentPage) ? 1 : this.currentPage;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.getUserPostCount();
    this.getUserInfo();
    
    this.postService.postDelete_Observable.subscribe(res => {
      this.getUserPostCount();
      this.getUserPosts();
    })
  }

  getUserInfo() {
    this.userService.getUser(this.username).subscribe(
      res => {
        this.user = res.user;
        this.imageSource = (this.user['base64']) ? 'data:image/png;base64,' + this.user['base64'] : this.defaultImageSource;
        this.getLoggedInUsername();
        this.getUserPosts();
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

  getUserPosts() {
    if (this.currentPage < 1 || !Number.isInteger(Number(this.currentPage))) {
      this.currentPage = 1;
      this.router.navigate([`u/${this.username}`], { queryParams: { page: this.currentPage } });
      return;
    }
    let pageOffset = (this.currentPage - 1).toString();
    this.userService.getUserPosts(this.username, pageOffset).subscribe(
      res => {
        this.posts = res;
        this.isLoaded = true;
        if (!this.posts.length && this.currentPage != 1) {
          let maxPage = this.pages[this.pages.length - 1];
          this.currentPage = (this.currentPage > maxPage) ? maxPage : 1;
          this.router.navigate([`u/${this.username}`], { queryParams: { page: this.currentPage } });
        }
      },
      err => console.log(err)
    )
  }

  getUserPostCount() {
    this.userService.getUserPostCount(this.username).subscribe(
      res => {
        let numberOfPages = Math.ceil(res / 10);
        this.pages = Array.from(Array(numberOfPages)).map((x, i) => i + 1);
      }
    )
  }

  setPostToDelete(post: Post) {
    this.postService.setPostToDelete(post);
    $('#deletepost')
      .modal({
        transition: 'vertical flip'
      })
      .modal('show');
  }

  setPostToEdit(post: Post) {
    this.postService.setPostToEdit(post);
    $('#editpost')
      .modal({
        transition: 'slide down',
        autofocus: false
      })
      .modal('show');
  }

}
