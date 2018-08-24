import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {

  comment: Comment;
  @Input() post_id: number;

  constructor(
    private commentService: CommentService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.makeNewComment();
  }

  addComment() {
    this.commentService.addComment(this.comment).subscribe(
      res => {
        this.commentService.notifyCommentAdditionOrEditionOrDeletion();
        this.makeNewComment();
      },
      err => console.log(err)
    )
  }

  makeNewComment() {
    this.comment = new Comment();
    this.comment.author_id = +this.authService.getId();
    this.comment.post_id = this.post_id;
  }

}
