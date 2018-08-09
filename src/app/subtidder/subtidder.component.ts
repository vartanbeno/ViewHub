import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
declare var $: any;

@Component({
  selector: 'app-subtidder',
  templateUrl: './subtidder.component.html',
  styleUrls: ['./subtidder.component.css']
})
export class SubtidderComponent implements OnInit {

  subtidder: string;
  @ViewChild('addPostToSubtidderButton') addPostToSubtidderButton: ElementRef;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private renderer: Renderer,
    private route: ActivatedRoute
  ) {
    this.subtidder = this.route.snapshot.paramMap.get('subtidder');
  }

  ngOnInit() {
    this.postService.subtidderLoaded = false;
  }

  ngAfterViewInit() {
    if (this.authService.loggedIn()) {
      this.renderer.listen(this.addPostToSubtidderButton.nativeElement, 'click', (event) => {
        $('#addposttosubtidder')
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

}
