import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() { }

  killModals() {
    let modals = Array.from(document.querySelectorAll('#addpost'));
    modals.forEach((modal) => {
      modal.id = (modal.className.includes('hidden')) ? '' : modal.id;
    })
  }

}
