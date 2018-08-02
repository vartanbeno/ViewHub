import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubtidderService } from '../subtidder.service';
import { PostService } from '../post.service';

@Component({
  selector: 'app-search-subtidders',
  templateUrl: './search-subtidders.component.html',
  styleUrls: ['./search-subtidders.component.css']
})
export class SearchSubtiddersComponent implements OnInit {

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
      res => this.subtidders = res,
      err => console.log(err)
    )
  }

  searchPosts() {
    this.postService.searchPosts(this.searchTerm).subscribe(
      res => {
        this.posts = res;
        this.isLoaded = true;
      },
      err => console.log(err)
    )
  }

}
