import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateViewComponent } from './create-view.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateViewComponent', () => {
  let component: CreateViewComponent;
  let fixture: ComponentFixture<CreateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateViewComponent ],
      imports: [
        FormsModule,
        HttpClientModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
