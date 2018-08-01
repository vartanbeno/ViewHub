import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Post } from '../models/post';
import { PostService } from '../post.service';
import { SubtidderService } from '../subtidder.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  postData: Post;
  subtidders: Array<any> = [];
  @ViewChild('title') title: ElementRef;
  @ViewChild('content') content: ElementRef;
  postHasError: boolean = true;

  constructor(private postService: PostService, private subtidderService: SubtidderService) { }

  ngOnInit() {
    this.postData = new Post();
    this.getAllSubtidders();
  }

  /**
   * Prevent the modal from closing on enter.
   * For some reason even if the required fields
   * are left empty, it closes.
   */
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  checkForError() {
    if (this.postData.subtidder &&
        this.title.nativeElement.value.length &&
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
