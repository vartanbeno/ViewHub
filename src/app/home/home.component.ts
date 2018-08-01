import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { AuthService } from '../auth.service';
import { PostService } from '../post.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Array<any> = [];
  isLoaded: boolean = false;
  @ViewChild('addPostButton') addPostButton: ElementRef;

  constructor(private postService: PostService, private authService: AuthService, private renderer: Renderer) { }

  ngOnInit() {
    this.getPosts();
    this.postService.postAdded_Observable.subscribe(res => this.getPosts())

    /**
     * If we want to automatically update the list of posts every 10 seconds.
     */
    // setInterval(() => {
    //   this.getPosts();
    // }, 1000 * 10);
  }

  ngAfterViewInit() {
    if (this.authService.loggedIn()) {
      this.renderer.listen(this.addPostButton.nativeElement, 'click', (event) => {
        $('#addpost').modal('show');
      })
    }
  }

  getPosts() {
    this.postService.getPosts().subscribe(
      res => {
        this.posts = res;
        this.isLoaded = true;
      },
      err => console.log(err)
    )
  }

}
