import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubtidderService } from '../../services/subtidder.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchTerm: string;
  subtidders: Array<any> = [];
  posts: Array<any> = [];
  isLoaded: boolean = false;

  constructor(
    private subtidderService: SubtidderService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => this.searchTerm = params.s);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.searchSubtidders();
    this.searchPosts();
  }

  searchSubtidders() {
    this.subtidderService.searchSubtidders(this.searchTerm).subscribe(
      res => this.subtidders = res.subtidders,
      err => console.log(err)
    )
  }

  searchPosts() {
    this.postService.searchPosts(this.searchTerm).subscribe(
      res => {
        this.posts = res.posts;
        this.isLoaded = true;
      },
      err => console.log(err)
    )
  }

}
