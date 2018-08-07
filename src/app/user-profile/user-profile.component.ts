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
  pictureData: Object = {};
  userDoesNotExist: boolean = false;
  isLoaded: boolean = false;

  @ViewChild('addProfilePicButton') addProfilePicButton: ElementRef;
  @ViewChild('profilePic') profilePic: ElementRef;
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

          this.renderer.listen(this.profilePicInput.nativeElement, 'change', (event) => {
            let file = event.srcElement.files[0];
            if (FileReader && file) {
              let fr = new FileReader();
              fr.onload = () => {
                this.profilePic.nativeElement.src = fr.result;
                let byteData = fr.result.split(';')[1].replace('base64,', '');
                let imageName = file.name;
                let contentType = file.type;
                this.pictureData = {
                  byteData: byteData,
                  imageName: imageName,
                  contentType: contentType
                };
                this.updateProfilePicture();
              }
              fr.readAsDataURL(file);
            }
          })
          
        }, 500);
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

  updateProfilePicture() {
    this.userService.updateProfilePicture(this.username, this.pictureData).subscribe(
      res => console.log(res),
      err => console.log(err)
    )
  }

}
