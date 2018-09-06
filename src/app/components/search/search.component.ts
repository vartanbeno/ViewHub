import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewService } from '../../services/view.service';
import { PostService } from '../../services/post.service';
import { View } from '../../models/view';
import { Post } from '../../models/post';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchQuery: string;
  views: View[];
  posts: Post[];
  isLoaded: boolean = false;

  constructor(
    private viewService: ViewService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => this.searchQuery = params.q);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.searchViews();
    this.searchPosts();
  }

  searchViews() {
    this.viewService.searchViews(this.searchQuery).subscribe(
      res => this.views = res['views'],
      err => console.log(err)
    )
  }

  searchPosts() {
    this.postService.searchPosts(this.searchQuery).subscribe(
      res => {
        this.posts = res['posts'];
        this.isLoaded = true;
      },
      err => console.log(err)
    )
  }

}
