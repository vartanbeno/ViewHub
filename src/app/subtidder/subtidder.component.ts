import { Component, OnInit } from '@angular/core';
import { SubtidderService } from '../services/subtidder.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subtidder',
  templateUrl: './subtidder.component.html',
  styleUrls: ['./subtidder.component.css']
})
export class SubtidderComponent implements OnInit {

  subtidder: string;

  constructor(
    private subtidderService: SubtidderService,
    private route: ActivatedRoute
  ) {
    this.subtidder = this.route.snapshot.paramMap.get('subtidder');
  }

  ngOnInit() {
  }

}
