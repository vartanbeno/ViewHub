import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subtidder } from '../../models/subtidder';
import { SubtidderService } from '../../services/subtidder.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-subtidder',
  templateUrl: './create-subtidder.component.html',
  styleUrls: ['./create-subtidder.component.css']
})
export class CreateSubtidderComponent implements OnInit {

  subtidderData: Subtidder;
  nameInvalid: boolean = false;
  @ViewChild('subtidderNameInput') subtidderNameInput: ElementRef;

  constructor(
    private subtidderService: SubtidderService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subtidderData = new Subtidder();
    this.subtidderData.creator_id = this.authService.getId();
    this.subtidderNameInput.nativeElement.focus();
  }

  createSubtidder() {
    this.subtidderService.createSubtidder(this.subtidderData).subscribe(
      res => this.router.navigate([`t/${this.subtidderData.name}`]),
      err => this.nameInvalid = (err.status === 400)
    )
  }

}
