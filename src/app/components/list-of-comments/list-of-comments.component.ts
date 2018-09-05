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

  @Input() comments: Comment[];
  @Input() isUserProfile?: boolean;

  constructor(
    private commentService: CommentService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  setCommentToEdit(comment_id: number) {
    let commentToEdit = this.comments.find(comment => comment.id === comment_id);
    commentToEdit['editing'] = true;
    commentToEdit['editedBody'] = commentToEdit.body;
    setTimeout(() => document.getElementById('body' + comment_id).focus());
  }

  unsetCommentToEdit(comment_id: number) {
    this.comments.find(comment => comment.id === comment_id)['editing'] = false;
  }

  editComment(comment_id: number) {
    let editedComment = this.comments.find(comment => comment.id === comment_id);
    
    if (editedComment.body === editedComment['editedBody']) {
      this.unsetCommentToEdit(comment_id);
      return;
    }

    this.commentService.editComment(comment_id, editedComment['editedBody']).subscribe(
      res => {
        editedComment.body = editedComment['editedBody'];
        this.unsetCommentToEdit(comment_id);
        this.commentService.notifyCommentAdditionOrEditionOrDeletion();
      },
      err => console.log(err)
    )
  }

  deleteComment(comment_id: number) {
    let confirmDelete = confirm('Click OK to delete the comment.');

    if (confirmDelete) {
      this.commentService.deleteComment(comment_id).subscribe(
        res => this.commentService.notifyCommentAdditionOrEditionOrDeletion(),
        err => console.log(err)
      )
    }

  }

}
