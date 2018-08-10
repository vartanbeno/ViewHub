import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  postEditData: Post = new Post();
  editContent: string;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.postService.postEdit_Observable.subscribe(res => {
      this.postEditData = this.postService.postToBeEdited;
      this.editContent = this.postEditData.content;
    })
  }

  editPost() {
    this.postEditData.content = this.editContent;
    this.postService.editPost(this.postEditData).subscribe(
      res => {
        this.postService.notifyPostEdition();
        this.postEditData = new Post();
      },
      err => console.log(err)
    )
  }

}
