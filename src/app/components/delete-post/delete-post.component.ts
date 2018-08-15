import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./delete-post.component.css']
})
export class DeletePostComponent implements OnInit {

  postId: number;
  @Input() navigateBackHome?: boolean;

  constructor(
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  deletePost() {
    this.postService.deletePost().subscribe(
      res => {
        this.postService.notifyPostDeletion();
        if (this.navigateBackHome) this.router.navigate(['']);
      },
      err => console.log(err)
    )
  }

}
