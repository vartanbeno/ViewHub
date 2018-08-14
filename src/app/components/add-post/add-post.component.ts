import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { SubtidderService } from '../../services/subtidder.service';
declare var $: any;

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  @Input() subtidder: string;

  postData: Post;
  subtidders: Array<any> = [];

  constructor(private postService: PostService, private subtidderService: SubtidderService) { }

  ngOnInit() {
    this.makeNewPost();
    this.getAllSubtidders();
  }

  submitPost() {
    this.postData.userId = localStorage.getItem('id');
    this.postService.submitPost(this.postData).subscribe(
      res => {
        this.postService.notifyPostAddition();
        this.makeNewPost();
      },
      err => console.log(err)
    )
  }

  getAllSubtidders() {
    this.subtidderService.getAllSubtidders().subscribe(
      res => {
        this.subtidders = res;
        $('#select-subtidder').dropdown();
      },
      err => console.log(err)
    )
  }

  makeNewPost() {
    this.postData = new Post();
    if (this.subtidder) this.postData.subtidder = this.subtidder;
  }

}
