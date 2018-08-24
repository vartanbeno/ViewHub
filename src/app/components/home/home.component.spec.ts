import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { DebugElement, Renderer } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AddPostComponent } from '../add-post/add-post.component';
import { ListOfPostsComponent } from '../list-of-posts/list-of-posts.component';
import { LoaderComponent } from '../loader/loader.component';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { DeletePostComponent } from '../delete-post/delete-post.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;
  let loggedOutHeader: HTMLElement;
  let loggedInHeader: HTMLElement;

  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        AddPostComponent,
        ListOfPostsComponent,
        LoaderComponent,
        ErrorMessageComponent,
        EditPostComponent,
        DeletePostComponent
      ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        HomeComponent,
        { provide: AuthService, useClass: MockAuthService },
        Renderer
      ]
    })
    .compileComponents();
    
    authService = TestBed.get(AuthService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('greeting message', () => {
    it(`should say 'Welcome to Tidder!' on the homepage if user is not logged in`, () => {
      expect(authService.loggedIn()).toBe(false);
      debugElement = fixture.debugElement.query(By.css('div[class=header]'));
      loggedOutHeader = debugElement.nativeElement;
      expect(loggedOutHeader.textContent).toEqual('Welcome to Tidder!');
    })

    it(`should say 'Hello, [name]' on the homepage if user is logged in`, () => {
      login();
      fixture.detectChanges();
      expect(authService.loggedIn()).toBe(true);

      debugElement = fixture.debugElement.query(By.css('h2'));
      loggedInHeader = debugElement.nativeElement;

      expect(loggedInHeader.textContent).toContain('Hello, test');
    })
  })

  describe(`presence of different elements`, () => {
    it('should only have add-post component if user is logged in', () => {
      debugElement = fixture.debugElement.query(By.css('app-add-post'));
      expect(debugElement).toBeNull();

      login();
      fixture.detectChanges();
      expect(authService.loggedIn()).toBe(true);

      debugElement = fixture.debugElement.query(By.css('app-add-post'));
      expect(debugElement).toBeTruthy();
    })

    it('should only display add post button if user is logged in', () => {
      debugElement = fixture.debugElement.query(By.css('#addPostButton'));
      expect(debugElement).toBeNull();

      login();
      fixture.detectChanges();
      expect(authService.loggedIn()).toBe(true);

      debugElement = fixture.debugElement.query(By.css('#addPostButton'));
      expect(debugElement).toBeTruthy();
    })

    it('should only display list-of-posts component if user is logged in', () => {
      debugElement = fixture.debugElement.query(By.css('app-list-of-posts'));
      expect(debugElement).toBeNull();

      login();
      fixture.detectChanges();
      expect(authService.loggedIn()).toBe(true);

      debugElement = fixture.debugElement.query(By.css('app-list-of-posts'));
      expect(debugElement).toBeTruthy();
    })
  })

  afterEach(() => {
    logout();
  })
});

function login() {
  localStorage.setItem('token', 'token');
  localStorage.setItem('name', 'test');
  localStorage.setItem('id', '1');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  localStorage.removeItem('id');
}

class MockAuthService {
  loggedIn() {
    return !!(this.getToken() && this.getName() && this.getId());
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getName() {
    return localStorage.getItem('name');
  }

  getId() {
    return localStorage.getItem('id');
  }
}
