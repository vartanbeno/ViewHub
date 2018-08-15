import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { SubtidderService } from '../../services/subtidder.service';
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

  constructor(
    private postService: PostService,
    private subtidderService: SubtidderService,
    private authService: AuthService,
    private renderer: Renderer,
    private route: ActivatedRoute
  ) {
    this.subtidder = this.route.snapshot.paramMap.get('subtidder');
  }

  ngOnInit() {
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
        this.postService.subtidderLoaded = true;
      },
      err => console.log(err)
    )
  }

}
