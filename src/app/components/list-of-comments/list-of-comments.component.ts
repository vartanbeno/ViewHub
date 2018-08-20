import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-list-of-comments',
  templateUrl: './list-of-comments.component.html',
  styleUrls: ['./list-of-comments.component.css']
})
export class ListOfCommentsComponent implements OnInit {

  @Input() postId: string;
  comments: Array<any> = [];
  noComments: boolean = false;

  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.getComments();
  }

  getComments() {
    this.commentService.getPostComments(this.postId).subscribe(
      res => {
        this.comments = res;
        this.noComments = (this.comments.length) ? false : true;
      },
      err => console.log(err)
    )
  }

}
