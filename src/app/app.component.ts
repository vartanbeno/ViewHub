import { Component } from '@angular/core';
import { SubtidderService } from './subtidder.service';
import { AuthService } from './auth.service';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  subscriptions: Array<any> = [];

  constructor(private subtidderService: SubtidderService, private authService: AuthService) { }

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
