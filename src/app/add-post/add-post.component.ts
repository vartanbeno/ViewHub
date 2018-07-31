import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  postData: Post;
  @ViewChild('title') title: ElementRef;
  @ViewChild('content') content: ElementRef;
  postHasError: boolean = true;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.postData = new Post('', '', '', 'nba');
  }

  checkForError() {
    if (this.title.nativeElement.value.length &&
        this.title.nativeElement.value.length <= 300 &&
        this.content.nativeElement.value.length &&
        this.content.nativeElement.value.length <= 40000) {
      this.postHasError = false;
    }
    else {
      this.postHasError = true;
    }
  }

  submitPost() {
    this.postData.userId = localStorage.getItem('id');
    this.postService.submitPost(this.postData).subscribe(
      res => console.log(res),
      err => console.log(err)
    )
  }

}
