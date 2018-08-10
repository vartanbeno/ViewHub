import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-add-post-to-subtidder',
  templateUrl: './add-post-to-subtidder.component.html',
  styleUrls: ['./add-post-to-subtidder.component.css']
})
export class AddPostToSubtidderComponent implements OnInit {

  postData: Post;
  @Input() subtidder: string;

  constructor(
    private postService: PostService
  ) { }

  ngOnInit() {
    this.makeNewPost();
  }

  makeNewPost() {
    this.postData = new Post();
    this.postData.subtidder = this.subtidder;
  }

  submitPostToSubtidder() {
    this.postData.userId = localStorage.getItem('id');
    this.postService.submitPost(this.postData).subscribe(
      res => {
        this.postService.notifyPostAddition();
        this.makeNewPost();
      },
      err => console.log(err)
    )
  }

}
