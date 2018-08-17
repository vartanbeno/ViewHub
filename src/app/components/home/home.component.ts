import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  pages: Array<number> = []
  currentPage: number;
  @ViewChild('addPostButton') addPostButton: ElementRef;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private renderer: Renderer,
  ) {
  }

  ngOnInit() {
    this.userService.homeLoaded = false;
    this.userService.noSubscriptions = false;
  }

  ngAfterViewInit() {
    if (this.authService.loggedIn()) {
      this.renderer.listen(this.addPostButton.nativeElement, 'click', (event) => {
        $('#addpost')
            .modal({
              transition: 'slide down',
              autofocus: false
            })
            .modal('show');
      })
    }
  }

}
