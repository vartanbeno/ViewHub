import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { View } from '../../models/view';
import { ViewService } from '../../services/view.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-view',
  templateUrl: './create-view.component.html',
  styleUrls: ['./create-view.component.css']
})
export class CreateViewComponent implements OnInit {

  viewData: View;
  nameInvalid: boolean = false;
  @ViewChild('viewNameInput') viewNameInput: ElementRef;

  constructor(
    private viewService: ViewService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.viewData = new View();
    this.viewData.creator_id = this.authService.getId();
    this.viewNameInput.nativeElement.focus();
  }

  createView() {
    this.viewService.createView(this.viewData).subscribe(
      res => this.router.navigate([`v/${this.viewData.name}`]),
      err => this.nameInvalid = (err.status === 400)
    )
  }

}
