import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from '../../models/post';
import { UserService } from '../../services/user.service';
import { SubtidderService } from '../../services/subtidder.service';
declare var $: any;

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
        this.countPosts();
        this.getPosts();

        this.postService.postAdded_Observable.subscribe(res => {
          this.countPosts();
          this.getPosts();
        })

        this.postService.postDelete_Observable.subscribe(res => {
          this.countPosts();
          this.getPosts();
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

  getPosts() {
    if (this.currentPage < 1 || !Number.isInteger(Number(this.currentPage))) {
      this.currentPage = 1;
      this.router.navigate([''], { queryParams: { page: this.currentPage } });
      return;
    }
    let pageOffset = (this.currentPage - 1).toString()
    this.postService.getPosts(pageOffset).subscribe(
      res => {
        this.posts = res;
        this.postService.allPosts = this.posts;
        this.postService.homeLoaded = true;
        if (!this.posts.length && this.currentPage != 1) {
          let maxPage = this.pages[this.pages.length - 1];
          this.currentPage = (this.currentPage > maxPage) ? maxPage : 1;
          this.router.navigate([''], { queryParams: { page: this.currentPage } });
        }
      },
      err => console.log(err)
    )
  }

  countPosts() {
    this.postService.countPosts().subscribe(
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
        this.postService.subtidderLoaded = true;
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
