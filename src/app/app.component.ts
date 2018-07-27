import { Component } from '@angular/core';
import { SubtidderService } from './subtidder.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  subscriptions: Array<any> = [];

  constructor(private subtidderService: SubtidderService) { }

  ngAfterViewInit() {
    this.getSubscriptions();
    $('.ui.dropdown').dropdown();
  }

  getSubscriptions() {
    this.subtidderService.getSubscriptions().subscribe(
      res => this.subscriptions = res,
      err => console.log(err)
    )
  }

}
