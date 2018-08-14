import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subtidder } from '../../models/subtidder';
import { SubtidderService } from '../../services/subtidder.service';

@Component({
  selector: 'app-create-subtidder',
  templateUrl: './create-subtidder.component.html',
  styleUrls: ['./create-subtidder.component.css']
})
export class CreateSubtidderComponent implements OnInit {

  subtidderData: Subtidder = new Subtidder();
  nameIsAll: boolean = false;
  @ViewChild('subtidderNameInput') subtidderNameInput: ElementRef;

  constructor(private subtidderService: SubtidderService) { }

  ngOnInit() {
    this.subtidderNameInput.nativeElement.focus();
  }

  createSubtidder() {
    if (this.subtidderData.name === 'all') {
      this.nameIsAll = true;
      return;
    }

    this.subtidderService.createSubtidder(this.subtidderData).subscribe(
      res => {
        console.log(res);
        this.subtidderData = new Subtidder();
      },
      err => console.log(err)
    )
  }

}
