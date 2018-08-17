import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SubtidderService } from '../../services/subtidder.service';

@Component({
  selector: 'app-list-of-posts',
  templateUrl: './list-of-posts.component.html',
  styleUrls: ['./list-of-posts.component.css']
})
export class ListOfPostsComponent implements OnInit {

  @Input() componentName: string;
  @Input() username?: string;
  @Input() subtidder?: string;

  posts: Array<any> = [];
  pages: Array<number> = [];
  currentPage: number;

  constructor(
    private postService: PostService,
    private subtidderService: SubtidderService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => this.currentPage = params.page);
    this.currentPage = (!this.currentPage) ? 1 : this.currentPage;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {

    switch(this.componentName) {

      case 'HomeComponent':
        if (this.authService.loggedIn() && this.userService.subscriptions.length) {
          this.countPostsFromSubscriptions();
          this.getPostsFromSubscriptions();
        }
        else if (!this.userService.subscriptions.length) {
          this.userService.noSubscriptions = true;
        }

        this.userService.subscriptionsFetch_Observable.subscribe(res => {
          if (!this.userService.subscriptions.length) {
            this.userService.noSubscriptions = true;
            this.userService.homeLoaded = true;
            return;
          }
          this.countPostsFromSubscriptions();
          this.getPostsFromSubscriptions();
        })

        this.postService.postAdded_Observable.subscribe(res => {
          this.countPostsFromSubscriptions();
          this.getPostsFromSubscriptions();
        })

        this.postService.postDelete_Observable.subscribe(res => {
          this.countPostsFromSubscriptions();
          this.getPostsFromSubscriptions();
        })
        break;

      case 'UserProfileComponent':
        this.getUserPostCount();
        this.getUserPosts();

        this.postService.postDelete_Observable.subscribe(res => {
          this.getUserPostCount();
          this.getUserPosts();
        })
        break;

      case 'SubtidderComponent':
        this.getSubtidderPostsCount();
        this.getSubtidderPosts();

        this.postService.postAdded_Observable.subscribe(res => {
          this.getSubtidderPostsCount();
          this.getSubtidderPosts();
        })

        this.postService.postDelete_Observable.subscribe(res => {
          this.getSubtidderPostsCount();
          this.getSubtidderPosts();
        })
        break;

      default:
        console.log("There's something wrong...");

    }
  }

  navigateToPage(pageNumber: number) {
    this.router.navigate([this.router.url.split('?')[0]], { queryParams: { page: pageNumber } });
  }

  getPostsFromSubscriptions() {
    if (this.currentPage < 1 || !Number.isInteger(Number(this.currentPage))) {
      this.currentPage = 1;
      this.router.navigate([''], { queryParams: { page: this.currentPage } });
      return;
    }
    let pageOffset = (this.currentPage - 1).toString()
    this.userService.getPostsFromSubscriptions(this.userService.subscriptions, pageOffset).subscribe(
      res => {
        this.posts = res;
        this.userService.subscriptionsPosts = this.posts;
        this.userService.homeLoaded = true;
        if (!this.posts.length && this.currentPage != 1) {
          let maxPage = this.pages[this.pages.length - 1];
          this.currentPage = (this.currentPage > maxPage) ? maxPage : 1;
          this.router.navigate([''], { queryParams: { page: this.currentPage } });
        }
      },
      err => console.log(err)
    )
  }

  countPostsFromSubscriptions() {
    this.userService.countPostsFromSubscriptions(this.userService.subscriptions).subscribe(
      res => {
        let numberOfPages = Math.ceil(res / 10);
        this.pages = Array.from(Array(numberOfPages)).map((x, i) => i + 1);
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
        this.userService.userPosts = this.posts;
        this.userService.profileLoaded = true;
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
      },
      err => console.log(err)
    )
  }

  getSubtidderPosts() {
    if (this.currentPage < 1 || !Number.isInteger(Number(this.currentPage))) {
      this.currentPage = 1;
      this.router.navigate([''], { queryParams: { page: this.currentPage } });
      return;
    }
    let pageOffset = (this.currentPage - 1).toString()
    this.postService.getPostsFromSubtidder(this.subtidder, pageOffset).subscribe(
      res => {
        this.posts = res;
        this.postService.subtidderPosts = this.posts;
        this.subtidderService.notifySubtidderInfo();
        if (!this.posts.length && this.currentPage != 1) {
          let maxPage = this.pages[this.pages.length - 1];
          this.currentPage = (this.currentPage > maxPage) ? maxPage : 1;
          this.router.navigate([`t/${this.subtidder}`], { queryParams: { page: this.currentPage } });
        }
      },
      err => {
        if (err.status === 404) {
          this.postService.subtidderLoaded = true;
          this.postService.subtidderDoesNotExist = true;
        }
      }
    )
  }

  getSubtidderPostsCount() {
    this.postService.countPostsFromSubtidder(this.subtidder).subscribe(
      res => {
        let numberOfPages = Math.ceil(res / 10);
        this.pages = Array.from(Array(numberOfPages)).map((x, i) => i + 1);
      },
      err => console.log(err)
    )
  }

}
