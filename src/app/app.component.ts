import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { SubtidderService } from './subtidder.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  userId: Object = {};
  subscriptions: Array<any> = [];
  @ViewChild('searchBox') searchBox: ElementRef;

  constructor(private subtidderService: SubtidderService, private authService: AuthService, private router: Router) { }

  ngAfterViewInit() {
    if (this.authService.loggedIn()) {
      this.getSubscriptions();
      this.subtidderService.subscriptions_Observable.subscribe(res => this.getSubscriptions());
    }
  }

  getSubscriptions() {
    this.userId['id'] = localStorage.getItem('id');
    this.subtidderService.getSubscriptions(this.userId).subscribe(
      res => {
        this.subscriptions = res;
        $('.ui.dropdown').dropdown();
      },
      err => console.log(err)
    )
  }

  focusOnSearch() {
    this.searchBox.nativeElement.focus();
  }

  searchSubtidders() {
    let s = this.searchBox.nativeElement.value;

    if (!s) return;

    this.router.navigate(['search'], { queryParams: { s: s } });
    
    this.searchBox.nativeElement.value = '';
    this.searchBox.nativeElement.blur();
  }

}
