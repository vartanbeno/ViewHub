import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('addPostButton') addPostButton: ElementRef;

  pages: Array<number>
  currentPage: number;

  posts: Array<Post>;
  user_id: number;

  homeLoaded: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private postService: PostService,
    private renderer: Renderer,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.route.queryParams.subscribe(params => this.currentPage = params.page);
    if (this.currentPage && isNaN(this.currentPage) || this.currentPage < 1) {
      this.router.navigate([this.router.url.split('?')[0]], { queryParams: { page: 1 } });
      return;
    }
    this.currentPage = this.currentPage || 1;
  }

  ngOnInit() {
    this.user_id = +this.authService.getId();

    if (this.authService.loggedIn()) this.getPostsFromSubscriptions();
    this.postService.postAdded_Or_Deleted_Observable.subscribe(res => this.getPostsFromSubscriptions());
  }

  getPostsFromSubscriptions() {
    this.userService.getPostsFromSubscriptions(this.user_id, this.currentPage.toString()).subscribe(
      res => {
        this.posts = res.posts;

        let numberOfPages = Math.ceil((res.numberOfPosts) / 10);
        this.pages = Array.from(Array(numberOfPages)).map((x, i) => i + 1);

        if (!this.posts.length && this.currentPage != 1) {
          let maxPage = this.pages[this.pages.length - 1];
          this.currentPage = (this.currentPage > maxPage) ? maxPage : 1;
          this.router.navigate([''], { queryParams: { page: this.currentPage } });
          return;
        }

        this.homeLoaded = true;
        setTimeout(() => this.attachClickEventListener());
      },
      err => console.log(err)
    )
  }

  attachClickEventListener() {
    this.renderer.listen(this.addPostButton.nativeElement, 'click', (event) => {
      $('#addpost')
        .modal({
          transition: 'slide down',
          autofocus: false
        })
        .modal('show');
    })
  }

}
