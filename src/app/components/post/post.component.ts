import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  id: string;
  postData: Object = {};
  postLoaded: boolean = false;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getPost();
    this.postService.postEdit_Observable.subscribe(res => this.getPost());
  }

  getPost() {
    this.postService.getPost(this.id).subscribe(
      res => {
        this.postData = res.post;
        this.postLoaded = true;
      },
      err => {
        console.log(err);
      }
    )
  }

}
