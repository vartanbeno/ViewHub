import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { Comment } from '../../models/comment';

@Component({
  selector: 'app-list-of-comments',
  templateUrl: './list-of-comments.component.html',
  styleUrls: ['./list-of-comments.component.css']
})
export class ListOfCommentsComponent implements OnInit {

  @Input() post_id: string;
  comments: Array<Comment> = [];
  noComments: boolean = false;

  constructor(
    private commentService: CommentService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getComments();
    this.commentService.commentAdded_or_Deleted_Observable.subscribe(res => this.getComments());
  }

  getComments() {
    this.commentService.getPostComments(this.post_id).subscribe(
      res => {
        this.comments = res.comments;
        this.noComments = (this.comments.length) ? false : true;
      },
      err => console.log(err)
    )
  }

  setCommentToEdit(comment_id: string) {
    let commentToEdit = this.comments.find(comment => comment.id === comment_id);
    commentToEdit['editing'] = true;
    commentToEdit['editedBody'] = commentToEdit.body;
    setTimeout(() => document.getElementById('body' + comment_id).focus());
  }

  unsetCommentToEdit(comment_id: string) {
    this.comments.find(comment => comment.id === comment_id)['editing'] = false;
  }

  editComment(comment_id: string) {
    let editedComment = this.comments.find(comment => comment.id === comment_id);

    this.commentService.editComment(comment_id, editedComment['editedBody']).subscribe(
      res => {
        editedComment.body = editedComment['editedBody'];
        this.unsetCommentToEdit(comment_id);
      },
      err => console.log(err)
    )
  }

  deleteComment(comment_id: string) {
    let confirmDelete = confirm('Click OK to delete the comment.');

    if (confirmDelete) {
      this.commentService.deleteComment(comment_id).subscribe(
        res => this.commentService.notifyCommentAdditionOrDeletion(),
        err => console.log(err)
      )
    }

  }

}
