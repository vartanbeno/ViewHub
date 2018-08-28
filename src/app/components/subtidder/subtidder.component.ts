import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { SubtidderService } from '../../services/subtidder.service';
import { UserService } from '../../services/user.service';
import { Subtidder } from '../../models/subtidder';
import { Post } from '../../models/post';
declare var $: any;

@Component({
  selector: 'app-subtidder',
  templateUrl: './subtidder.component.html',
  styleUrls: ['./subtidder.component.css']
})
export class SubtidderComponent implements OnInit {

  subtidder: string;
  subtidderData: Subtidder;
  @ViewChild('addPostToSubtidderButton') addPostToSubtidderButton: ElementRef;

  user_id: number;
  isSubscribed: boolean;

  pages: Array<number>;
  currentPage: number;

  posts: Array<Post>;
  isAll: boolean = false;

  subtidderLoaded: boolean = false;
  subtidderDoesNotExist: boolean = false;

  constructor(
    private postService: PostService,
    private subtidderService: SubtidderService,
    private userService: UserService,
    private authService: AuthService,
    private renderer: Renderer,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subtidder = this.route.snapshot.paramMap.get('subtidder');

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.route.queryParams.subscribe(params => this.currentPage = params.page);
    if (this.currentPage && isNaN(this.currentPage) || this.currentPage < 1) {
      this.router.navigate([`/t/${this.subtidder}`], { queryParams: { page: 1 } });
      return;
    }
    this.currentPage = this.currentPage || 1;
  }

  ngOnInit() {
    this.user_id = this.authService.getId();
    this.subtidderData = new Subtidder();

    this.isAll = (this.subtidder.toLowerCase() === 'all');

    if (this.isAll) {
      this.subtidderData.name = 'all';
      this.getSubtidderPosts();
    }
    else {
      this.getSubtidderInfo();
    }

    this.postService.postAdded_Or_Deleted_Observable.subscribe(res => this.getSubtidderPosts());
  }

  getSubtidderInfo() {
    this.subtidderService.getSubtidderInfo(this.subtidder).subscribe(
      res => {
        this.subtidderData = res.subtidderData;

        // url in browser should get correct case representation of subtidder name
        if (this.subtidder !== this.subtidderData.name) {
          this.router.navigate([`/t/${this.subtidderData.name}`], { queryParams: { page: this.currentPage } });
          return;
        }
        
        this.getSubtidderPosts();
        if (this.authService.loggedIn()) this.checkIfSubscribed();
      },
      err => {
        if (err.status === 404) {
          this.subtidderDoesNotExist = true;
          this.subtidderLoaded = true;
        }
      }
    )
  }

  checkIfSubscribed() {
    this.userService.checkIfSubscribed(this.user_id, this.subtidderData.name).subscribe(
      res => this.isSubscribed = res.isSubscribed,
      err => console.log(err)
    )
  }

  subscribe() {
    this.userService.subscribe(this.user_id, this.subtidderData.name).subscribe(
      res => {
        this.isSubscribed = true;
        this.userService.refreshSubscriptions();
      },
      err => console.log(err)
    )
  }

  unsubscribe() {
    this.userService.unsubscribe(this.user_id, this.subtidderData.name).subscribe(
      res => {
        this.isSubscribed = false;
        this.userService.refreshSubscriptions();
      },
      err => console.log(err)
    )
  }

  getSubtidderPosts() {
    this.postService.getPostsFromSubtidder(this.subtidderData.name, this.currentPage.toString()).subscribe(
      res => {
        this.posts = res.posts;

        let numberOfPages = Math.ceil((res.numberOfPosts) / 10);
        this.pages = Array.from(Array(numberOfPages)).map((x, i) => i + 1);

        if (!this.posts.length && this.currentPage != 1) {
          let maxPage = this.pages[this.pages.length - 1];
          this.currentPage = (this.currentPage > maxPage) ? maxPage : 1;
          this.router.navigate([`t/${this.subtidderData.name}`], { queryParams: { page: this.currentPage } });
          return;
        }

        this.subtidderLoaded = true;
        if (!this.isAll && this.authService.loggedIn()) setTimeout(() => this.attachClickEventListener());
      },
      err => console.log(err)
    )
  }

  attachClickEventListener() {
    this.renderer.listen(this.addPostToSubtidderButton.nativeElement, 'click', (event) => {
      $('#addpost')
        .modal({
          transition: 'slide down',
          autofocus: false
        })
        .modal('show');
    })
  }

}
