import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pages: Array<number> = []
  currentPage: number;
  @ViewChild('addPostButton') addPostButton: ElementRef;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private renderer: Renderer,
  ) {
  }

  ngOnInit() {
    this.postService.homeLoaded = false;
  }

  ngAfterViewInit() {
    if (this.authService.loggedIn() && this.postService.homeLoaded) {
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

}
