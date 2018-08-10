import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-delete-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./delete-post.component.css']
})
export class DeletePostComponent implements OnInit {

  postId: number;

  constructor(private postService: PostService) { }

  ngOnInit() {
  }

  deletePost() {
    this.postService.deletePost().subscribe(
      res => {
        this.postService.notifyPostDeletion();
        console.log(res);
      },
      err => console.log(err)
    )
  }

}
