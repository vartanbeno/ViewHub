import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PostService } from './services/post.service';
import { SubtidderService } from './services/subtidder.service';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { UsersComponent } from './components/users/users.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { SearchComponent } from './components/search/search.component';
import { DeletePostComponent } from './components/delete-post/delete-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { ListOfPostsComponent } from './components/list-of-posts/list-of-posts.component';
import { SubtidderComponent } from './components/subtidder/subtidder.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AddPostToSubtidderComponent } from './components/add-post-to-subtidder/add-post-to-subtidder.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    LoginComponent,
    UsersComponent,
    AddPostComponent,
    SearchComponent,
    DeletePostComponent,
    EditPostComponent,
    HeaderComponent,
    FooterComponent,
    UserProfileComponent,
    ErrorMessageComponent,
    ListOfPostsComponent,
    SubtidderComponent,
    LoaderComponent,
    AddPostToSubtidderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [AuthService, PostService, SubtidderService, AuthGuard,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
