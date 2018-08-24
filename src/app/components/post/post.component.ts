import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  post_id: number;
  post: Post;
  postLoaded: boolean = false;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.post_id = +this.route.snapshot.paramMap.get('post_id');
  }

  ngOnInit() {
    this.getPost();
    this.postService.postEdit_Observable.subscribe(res => this.getPost());
  }

  getPost() {
    this.postService.getPost(this.post_id).subscribe(
      res => {
        this.post = res.post;
        this.postLoaded = true;
      },
      err => {
        console.log(err);
      }
    )
  }

}
