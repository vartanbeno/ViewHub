import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  post_id: number;
  post: Post;
  comments: Array<Comment>;

  postLoaded: boolean = false;

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.post_id = +this.route.snapshot.paramMap.get('post_id');
  }

  ngOnInit() {
    this.getPost();
    this.postService.postEdit_Observable.subscribe(res => this.getPost());
    this.commentService.commentAdded_or_Edited_or_Deleted_Observable.subscribe(res => this.getComments());
  }

  getPost() {
    this.postService.getPost(this.post_id).subscribe(
      res => {
        this.post = res.post;
        this.getComments();
      },
      err => {
        console.log(err);
      }
    )
  }

  getComments() {
    this.commentService.getPostComments(this.post_id).subscribe(
      res => {
        this.comments = res.comments;
        this.postLoaded = true;
      },
      err => console.log(err)
    )
  }

}
