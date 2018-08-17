import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  id: string;
  subscriptions: Array<any> = [];
  @ViewChild('searchBox') searchBox: ElementRef;

  username: string;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.authService.loggedIn()) {
      this.getSubscriptions();
      this.getUsername();
    }

    this.userService.authentication_Observable.subscribe(res => {
      this.getSubscriptions();
      this.getUsername();
    });

    this.userService.subscriptionsList_Observable.subscribe(res => this.getSubscriptions());
    
    this.focusOnSearch();
  }

  getSubscriptions() {
    this.id = this.authService.getId();
    this.userService.getSubscriptions(this.id).subscribe(
      res => {
        this.subscriptions = res;
        if (!this.subscriptions.length) this.userService.noSubscriptions = true;
        this.activateDropdowns();
      },
      err => console.log(err)
    )
  }

  getUsername() {
    this.id = this.authService.getId();
    this.userService.getUsername(this.id).subscribe(
      res => this.username = res,
      err => console.log(err)
    )
  }

  activateDropdowns() {
    $('.ui.dropdown').dropdown();
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
