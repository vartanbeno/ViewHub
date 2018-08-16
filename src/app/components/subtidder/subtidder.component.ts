import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { SubtidderService } from '../../services/subtidder.service';
import { UserService } from '../../services/user.service';
declare var $: any;

@Component({
  selector: 'app-subtidder',
  templateUrl: './subtidder.component.html',
  styleUrls: ['./subtidder.component.css']
})
export class SubtidderComponent implements OnInit {

  subtidder: string;
  subtidderData: Object = {};
  @ViewChild('addPostToSubtidderButton') addPostToSubtidderButton: ElementRef;

  id: string;
  isSubscribed: boolean;

  constructor(
    private postService: PostService,
    private subtidderService: SubtidderService,
    private userService: UserService,
    private authService: AuthService,
    private renderer: Renderer,
    private route: ActivatedRoute
  ) {
    this.subtidder = this.route.snapshot.paramMap.get('subtidder');
  }

  ngOnInit() {
    this.id = this.authService.getId();
    this.subtidderService.subtidderInfo_Observable.subscribe(res => {
      if (this.subtidder === 'all') {
        this.subtidderData['name'] = 'all';
        this.postService.subtidderLoaded = true;
      };
      if (this.subtidder && this.subtidder !== 'all') this.getSubtidderInfo();
    })
    this.postService.subtidderLoaded = false;
    this.postService.subtidderDoesNotExist = false;
  }

  ngAfterViewInit() {
    if (this.authService.loggedIn() && this.subtidder !== 'all') {
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

  ngOnDestroy() {
    this.subtidder = void 0;
  }

  getSubtidderInfo() {
    this.subtidderService.getSubtidderInfo(this.subtidder).subscribe(
      res => {
        this.subtidderData = res;
        if (this.authService.loggedIn() && this.subtidder !== 'all') {
          this.checkIfSubscribed();
          return;
        };
        this.postService.subtidderLoaded = true;
      },
      err => console.log(err)
    )
  }

  checkIfSubscribed() {
    this.userService.checkIfSubscribed(this.id, this.subtidderData['name']).subscribe(
      res => {
        this.isSubscribed = (Number(res.count)) ? true : false;
        this.postService.subtidderLoaded = true;
      },
      err => console.log(err)
    )
  }

  subscribe() {
    this.userService.subscribe(this.id, this.subtidderData['name']).subscribe(
      res => {
        this.isSubscribed = true;
        this.userService.refreshSubscriptions();
      },
      err => console.log(err)
    )
  }

  unsubscribe() {
    this.userService.unsubscribe(this.id, this.subtidderData['name']).subscribe(
      res => {
        this.isSubscribed = false;
        this.userService.refreshSubscriptions();
      },
      err => console.log(err)
    )
  }

}
