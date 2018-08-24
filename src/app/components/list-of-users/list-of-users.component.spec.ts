import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfUsersComponent } from './list-of-users.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LoaderComponent } from '../loader/loader.component';
import { HttpClientModule } from '@angular/common/http';

describe('ListOfUsersComponent', () => {
  let component: ListOfUsersComponent;
  let fixture: ComponentFixture<ListOfUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListOfUsersComponent,
        LoaderComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
