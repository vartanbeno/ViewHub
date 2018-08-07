import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user = {};
  username: string;
  userDoesNotExist: boolean = false;
  isLoaded: boolean = false;

  @ViewChild('addProfilePicButton') addProfilePicButton: ElementRef;
  @ViewChild('profilePicInput') profilePicInput: ElementRef;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer
  ) {
    this.username = this.route.snapshot.paramMap.get('username');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.userService.getUser(this.username).subscribe(
      res => {
        this.user = res.user;
        this.isLoaded = true;
        setTimeout(() => {
          this.renderer.listen(this.addProfilePicButton.nativeElement, 'click', () => {
            this.profilePicInput.nativeElement.click();
          })
        }, 1000);
      },
      err => {
        console.log(err);
        if (err.status === 404) {
          this.userDoesNotExist = true;
          this.isLoaded = true;
        }
      }
    )
  }

}
