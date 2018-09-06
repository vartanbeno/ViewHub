import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { View } from '../../models/view';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  user_id: number;
  subscriptions: View[];
  @ViewChild('searchBox') searchBox: ElementRef;
  q: string;

  username: string;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user_id = this.authService.getId();
  }

  ngAfterViewInit() {
    if (this.authService.loggedIn()) {
      this.user_id = this.authService.getId();
      this.getSubscriptions();
      this.getUsername();
    }

    this.userService.authentication_Observable.subscribe(res => {
      this.user_id = this.authService.getId();
      this.getSubscriptions();
      this.getUsername();
    });

    this.userService.subscriptionsList_Observable.subscribe(res => this.getSubscriptions());
    
    this.searchBox.nativeElement.focus();
  }

  getSubscriptions() {
    this.userService.getSubscriptions(this.user_id).subscribe(
      res => {
        this.subscriptions = res.subscriptions;
        this.userService.noSubscriptions = !Boolean(this.subscriptions.length);
        this.activateDropdowns();
      },
      err => console.log(err)
    )
  }

  getUsername() {
    this.userService.getUsername(this.user_id).subscribe(
      res => this.username = res.username,
      err => console.log(err)
    )
  }

  activateDropdowns() {
    $('.ui.dropdown').dropdown();
  }

  search() {
    if (!this.q) return;
    
    this.router.navigate(['search'], { queryParams: { q: this.q } });
    this.searchBox.nativeElement.blur();
  }

}
