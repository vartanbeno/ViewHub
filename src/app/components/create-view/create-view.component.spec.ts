import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateViewComponent } from './create-view.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('CreateViewComponent', () => {
  let component: CreateViewComponent;
  let fixture: ComponentFixture<CreateViewComponent>;

  let createButton: DebugElement;

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
    createButton = fixture.debugElement.query(By.css('button[type=submit]'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createView method when submit button is clicked', () => {
    component.viewData.name = 'testname';
    component.viewData.description = 'test description';

    fixture.detectChanges();

    spyOn(component,'createView');
    createButton.nativeElement.click();

    fixture.whenStable().then(() => {
      expect(component.createView).toHaveBeenCalled();
    })
  })

  it(`should display error message if the view name is invalid`, () => {
    component.nameInvalid = true;
    fixture.detectChanges();

    let errorMessage: DebugElement = fixture.debugElement.query(By.css('#error-message'));
    expect(errorMessage).toBeTruthy();
  })
});
