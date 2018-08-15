import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subtidder } from '../../models/subtidder';
import { SubtidderService } from '../../services/subtidder.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-subtidder',
  templateUrl: './create-subtidder.component.html',
  styleUrls: ['./create-subtidder.component.css']
})
export class CreateSubtidderComponent implements OnInit {

  subtidderData: Subtidder;
  nameIsAll: boolean = false;
  @ViewChild('subtidderNameInput') subtidderNameInput: ElementRef;

  constructor(
    private subtidderService: SubtidderService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subtidderData = new Subtidder();
    this.subtidderNameInput.nativeElement.focus();
  }

  createSubtidder() {
    this.subtidderData.creator_id = localStorage.getItem('id');

    if (this.subtidderData.name === 'all') {
      this.nameIsAll = true;
      return;
    }

    this.subtidderService.createSubtidder(this.subtidderData).subscribe(
      res => this.router.navigate([`t/${this.subtidderData.name}`]),
      err => console.log(err)
    )
  }

}