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

  pagesCorrected: any[] = [];

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.pages.length >= 1 && this.currentPage <= this.pages.length) {
      this.pagesCorrected.push(1);
      let i = Math.max(2, this.currentPage - 2);
      if (i > 2) {
        this.pagesCorrected.push('...');
      }
      for (; i < Math.min(this.currentPage + 3, this.pages.length); i++) {
        this.pagesCorrected.push(i);
      }
      if (i != this.pages.length) {
        this.pagesCorrected.push('...');
      }
      this.pagesCorrected.push(this.pages.length);
      if (this.pagesCorrected[0] === this.pagesCorrected[this.pagesCorrected.length - 1]) this.pagesCorrected = [this.pagesCorrected[0]];
      this.pages = this.pagesCorrected;
    }
  }

  navigateToPage(page: string) {
    if (page === '...') return;
    this.router.navigate([this.router.url.split('?')[0]], { queryParams: { page } });
  }

}
