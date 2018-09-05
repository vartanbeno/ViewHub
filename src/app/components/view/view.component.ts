import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { ViewService } from '../../services/view.service';
import { UserService } from '../../services/user.service';
import { View } from '../../models/view';
import { Post } from '../../models/post';
declare var $: any;

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  view: string;
  viewData: View;
  @ViewChild('addPostToViewButton') addPostToViewButton: ElementRef;

  user_id: number;
  isSubscribed: boolean;

  pages: number[];
  currentPage: number;
  posts: Post[];
  
  isAll: boolean = false;

  viewLoaded: boolean = false;
  viewDoesNotExist: boolean = false;

  constructor(
    private postService: PostService,
    private viewService: ViewService,
    private userService: UserService,
    private authService: AuthService,
    private renderer: Renderer,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.view = this.route.snapshot.paramMap.get('view');

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.route.queryParams.subscribe(params => this.currentPage = +params.page);
    if (this.currentPage && isNaN(this.currentPage) || this.currentPage < 1) {
      this.router.navigate([`/v/${this.view}`], { queryParams: { page: 1 } });
      return;
    }
    this.currentPage = this.currentPage || 1;
  }

  ngOnInit() {
    this.user_id = this.authService.getId();
    this.viewData = new View();

    this.isAll = (this.view.toLowerCase() === 'all');

    if (this.isAll) {
      this.viewData.name = 'all';
      this.getViewPosts();
    }
    else {
      this.getViewInfo();
    }

    this.postService.postAdded_Or_Deleted_Observable.subscribe(res => this.getViewPosts());
  }

  getViewInfo() {
    this.viewService.getViewInfo(this.view).subscribe(
      res => {
        this.viewData = res.viewData;

        // url in browser should get correct case representation of view name
        if (this.view !== this.viewData.name) {
          this.router.navigate([`/v/${this.viewData.name}`], { queryParams: { page: this.currentPage } });
          return;
        }
        
        this.getViewPosts();
        if (this.authService.loggedIn()) this.checkIfSubscribed();
      },
      err => {
        if (err.status === 404) {
          this.viewDoesNotExist = true;
          this.viewLoaded = true;
        }
      }
    )
  }

  checkIfSubscribed() {
    this.userService.checkIfSubscribed(this.user_id, this.viewData.name).subscribe(
      res => this.isSubscribed = res.isSubscribed,
      err => console.log(err)
    )
  }

  subscribe() {
    this.userService.subscribe(this.user_id, this.viewData.name).subscribe(
      res => {
        this.isSubscribed = true;
        this.userService.refreshSubscriptions();
      },
      err => console.log(err)
    )
  }

  unsubscribe() {
    this.userService.unsubscribe(this.user_id, this.viewData.name).subscribe(
      res => {
        this.isSubscribed = false;
        this.userService.refreshSubscriptions();
      },
      err => console.log(err)
    )
  }

  getViewPosts() {
    this.postService.getPostsFromView(this.viewData.name, this.currentPage.toString()).subscribe(
      res => {
        this.posts = res.posts;

        let numberOfPages = Math.ceil((res.numberOfPosts) / 10);
        this.pages = Array.from(Array(numberOfPages)).map((x, i) => i + 1);

        if (!this.posts.length && this.currentPage != 1) {
          let maxPage = this.pages[this.pages.length - 1];
          this.currentPage = (this.currentPage > maxPage) ? maxPage : 1;
          this.router.navigate([`t/${this.viewData.name}`], { queryParams: { page: this.currentPage } });
          return;
        }

        this.viewLoaded = true;
        if (!this.isAll && this.authService.loggedIn()) setTimeout(() => this.attachClickEventListener());
      },
      err => console.log(err)
    )
  }

  attachClickEventListener() {
    this.renderer.listen(this.addPostToViewButton.nativeElement, 'click', (event) => {
      $('#addpost')
        .modal({
          transition: 'slide down',
          autofocus: false
        })
        .modal('show');
    })
  }

}
