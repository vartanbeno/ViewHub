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
  @Input() post_id: string;

  constructor(
    private commentService: CommentService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.comment = new Comment('', this.authService.getId(), this.post_id);
  }

  addComment() {
    console.log(this.comment);
  }

}
