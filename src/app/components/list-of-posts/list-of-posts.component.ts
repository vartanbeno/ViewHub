import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Post } from '../../models/post';
import { VoteService } from '../../services/vote.service';

@Component({
  selector: 'app-list-of-posts',
  templateUrl: './list-of-posts.component.html',
  styleUrls: ['./list-of-posts.component.css']
})
export class ListOfPostsComponent implements OnInit {

  @Input() posts: Post[];
  @Input() pages: number[];
  @Input() currentPage: number;

  pagesCorrected: any[];

  upvotedPosts: number[];
  downvotedPosts: number[];

  constructor(
    private postService: PostService,
    private voteService: VoteService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.getVotedPosts();
      this.voteService.votes_Observable.subscribe(res => this.getVotedPosts());
    }

    this.pagesCorrected = [];
    this.getPagesCorrected();
  }

  navigateToPage(page: string) {
    if (page === '...') return;
    this.router.navigate([this.router.url.split('?')[0]], { queryParams: { page } });
  }

  getPagesCorrected() {
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

  getVotedPosts() {
    this.getUpvotedPosts();
    this.getDownvotedPosts();
  }

  getUpvotedPosts() {
    this.voteService.getUpvotedPosts(this.authService.getId()).subscribe(
      res => this.upvotedPosts = res['posts'],
      err => console.log(err)
    )
  }

  getDownvotedPosts() {
    this.voteService.getDownvotedPosts(this.authService.getId()).subscribe(
      res => this.downvotedPosts = res['posts'],
      err => console.log(err)
    )
  }

  upvote(post_id: number) {
    if (!this.authService.loggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.upvotedPosts.includes(post_id)) {
      this.voteService.upvotePost(post_id, this.authService.getId()).subscribe(
        res => this.voteService.notifyVotes(),
        err => console.log(err)
      )
    }
    else {
      this.removeVote(post_id);
    }
  }

  downvote(post_id: number) {
    if (!this.authService.loggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.downvotedPosts.includes(post_id)) {
      this.voteService.downvotePost(post_id, this.authService.getId()).subscribe(
        res => this.voteService.notifyVotes(),
        err => console.log(err)
      )
    }
    else {
      this.removeVote(post_id);
    }
  }

  removeVote(post_id: number) {
    this.voteService.removeVote(post_id, this.authService.getId()).subscribe(
      res => this.voteService.notifyVotes(),
      err => console.log(err)
    )
  }

}
