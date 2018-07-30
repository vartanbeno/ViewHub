import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { PostService } from '../post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Array<any> = [];
  isLoaded: boolean = false;

  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit() {
    this.getPosts();
    /**
     * If we want to automatically update the list of posts every 10 seconds.
     */
    // setInterval(() => {
    //   this.getPosts();
    // }, 1000 * 10);
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
