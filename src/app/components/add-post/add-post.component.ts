import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  postData: Post;
  subtidders: Array<any> = [];

  constructor(private postService: PostService, private subtidderService: SubtidderService) { }

  ngOnInit() {
    this.postData = new Post();
    this.getAllSubtidders();
    $('.ui.dropdown').dropdown();
  }

  submitPost() {
    this.postData.userId = localStorage.getItem('id');
    this.postService.submitPost(this.postData).subscribe(
      res => {
        this.postService.notifyPostAddition();
        this.postData = new Post();
      },
      err => console.log(err)
    )
  }

  getAllSubtidders() {
    this.subtidderService.getAllSubtidders().subscribe(
      res => this.subtidders = res,
      err => console.log(err)
    )
  }

}
