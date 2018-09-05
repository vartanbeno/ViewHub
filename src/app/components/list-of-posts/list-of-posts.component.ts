import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Post } from '../../models/post';

@Component({
  selector: 'app-list-of-posts',
  templateUrl: './list-of-posts.component.html',
  styleUrls: ['./list-of-posts.component.css']
})
export class ListOfPostsComponent implements OnInit {

  @Input() posts: Post[];
  @Input() pages: number[];
  @Input() currentPage: number;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  navigateToPage(page: number) {
    this.router.navigate([this.router.url.split('?')[0]], { queryParams: { page } });
  }

}
