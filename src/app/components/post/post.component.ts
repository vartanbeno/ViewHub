import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  id: string;
  postData: Object = {};

  constructor(
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getPost();
  }

  ngOnInit() {
  }

  getPost() {
    this.postService.getPost(this.id).subscribe(
      res => {
        this.postData = res;
      },
      err => {
        console.log(err);
      }
    )
  }

}
