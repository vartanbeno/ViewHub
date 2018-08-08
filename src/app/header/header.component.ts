import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SubtidderService } from '../services/subtidder.service';
import { UserService } from '../services/user.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  id: string;
  subscriptions: Array<any> = [];
  subscribedToSubtidders: boolean = false;
  @ViewChild('searchBox') searchBox: ElementRef;

  username: string;

  constructor(
    private subtidderService: SubtidderService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.authService.loggedIn()) {
      this.getSubscriptions();
      this.subtidderService.subscriptions_Observable.subscribe(res => this.getSubscriptions());
      this.getUsername();
      this.userService.username_Observable.subscribe(res => this.getUsername());
    }
    this.focusOnSearch();
  }

  getSubscriptions() {
    this.id = localStorage.getItem('id');
    this.subtidderService.getSubscriptions(this.id).subscribe(
      res => {
        this.subscriptions = res;
        if (this.subscriptions.length) this.subscribedToSubtidders = true;
        $('.ui.dropdown').dropdown();
      },
      err => console.log(err)
    )
  }

  getUsername() {
    this.id = localStorage.getItem('id');
    this.userService.getUsername(this.id).subscribe(
      res => this.username = res,
      err => console.log(err)
    )
  }

  focusOnSearch() {
    this.searchBox.nativeElement.focus();
  }

  search() {
    let s = this.searchBox.nativeElement.value;

    if (!s) return;

    this.router.navigate(['search'], { queryParams: { s: s } });
    
    this.searchBox.nativeElement.value = '';
    this.searchBox.nativeElement.blur();
  }

}