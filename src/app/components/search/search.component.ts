import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubtidderService } from '../../services/subtidder.service';
import { PostService } from '../../services/post.service';
import { Subtidder } from '../../models/subtidder';
import { Post } from '../../models/post';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchQuery: string;
  subtidders: Array<Subtidder> = [];
  posts: Array<Post> = [];
  isLoaded: boolean = false;

  constructor(
    private subtidderService: SubtidderService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => this.searchQuery = params.q);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.searchSubtidders();
    this.searchPosts();
  }

  searchSubtidders() {
    this.subtidderService.searchSubtidders(this.searchQuery).subscribe(
      res => this.subtidders = res.subtidders,
      err => console.log(err)
    )
  }

  searchPosts() {
    this.postService.searchPosts(this.searchQuery).subscribe(
      res => {
        this.posts = res.posts;
        this.isLoaded = true;
      },
      err => console.log(err)
    )
  }

}
