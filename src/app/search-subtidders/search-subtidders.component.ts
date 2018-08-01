import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubtidderService } from '../subtidder.service';

@Component({
  selector: 'app-search-subtidders',
  templateUrl: './search-subtidders.component.html',
  styleUrls: ['./search-subtidders.component.css']
})
export class SearchSubtiddersComponent implements OnInit {

  searchTerm: string;
  subtidders: Array<any> = [];

  constructor(private subtidderService: SubtidderService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => this.searchTerm = params.s);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.searchSubtidders();
  }

  searchSubtidders() {
    this.subtidderService.searchSubtidders(this.searchTerm).subscribe(
      res => this.subtidders = res,
      err => console.log(err)
    )
  }

}
