import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-list-of-comments',
  templateUrl: './list-of-comments.component.html',
  styleUrls: ['./list-of-comments.component.css']
})
export class ListOfCommentsComponent implements OnInit {

  @Input() post_id: string;
  comments: Array<any> = [];
  noComments: boolean = false;

  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.getComments();
    this.commentService.commentAdded_Observable.subscribe(res => this.getComments());
  }

  getComments() {
    this.commentService.getPostComments(this.post_id).subscribe(
      res => {
        this.comments = res;
        this.noComments = (this.comments.length) ? false : true;
      },
      err => console.log(err)
    )
  }

}
