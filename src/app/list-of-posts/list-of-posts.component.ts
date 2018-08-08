import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from '../models/post';
declare var $: any;

@Component({
  selector: 'app-list-of-posts',
  templateUrl: './list-of-posts.component.html',
  styleUrls: ['./list-of-posts.component.css']
})
export class ListOfPostsComponent implements OnInit {

  @Input() componentName: string;

  @Input() posts: Array<any>;
  @Input() pages: Array<number>;
  @Input() currentPage: number;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  navigateToPage(pageNumber: number) {
    switch(this.componentName) {
      case 'HomeComponent':
        this.router.navigate([''], { queryParams: { page: pageNumber } });
        break;
      case 'UserProfileComponent':
        this.router.navigate([this.router.url.split('?')[0]], { queryParams: { page: pageNumber } });
        break;
      default:
        console.log("There's something wrong...");
    }
  }

  setPostToDelete(post: Post) {
    this.postService.setPostToDelete(post);
    $('#deletepost')
      .modal({
        transition: 'vertical flip'
      })
      .modal('show');
  }

  setPostToEdit(post: Post) {
    this.postService.setPostToEdit(post);
    $('#editpost')
      .modal({
        transition: 'slide down',
        autofocus: false
      })
      .modal('show');
  }

}
