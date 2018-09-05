import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { ViewService } from '../../services/view.service';
import { AuthService } from '../../services/auth.service';
import { View } from '../../models/view';
declare var $: any;

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  @Input() view: string;

  postData: Post;
  views: View[];

  constructor(
    private postService: PostService,
    private viewService: ViewService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.makeNewPost();
    this.getAllViews();
  }

  submitPost() {
    this.postData.author_id = this.authService.getId();
    this.postService.submitPost(this.postData).subscribe(
      res => {
        this.postService.notifyPostAdditionOrDeletion();
        this.makeNewPost();
      },
      err => console.log(err)
    )
  }

  getAllViews() {
    this.viewService.getAllViews().subscribe(
      res => {
        this.views = res.views;
        $('#select-view').dropdown();
      },
      err => console.log(err)
    )
  }

  makeNewPost() {
    this.postData = new Post();
    if (this.view) this.postData.view = this.view;
  }

}
