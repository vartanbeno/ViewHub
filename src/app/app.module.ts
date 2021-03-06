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
import { ViewService } from './services/view.service';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { ListOfUsersComponent } from './components/list-of-users/list-of-users.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { SearchComponent } from './components/search/search.component';
import { DeletePostComponent } from './components/delete-post/delete-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { ListOfPostsComponent } from './components/list-of-posts/list-of-posts.component';
import { ViewComponent } from './components/view/view.component';
import { LoaderComponent } from './components/loader/loader.component';
import { CreateViewComponent } from './components/create-view/create-view.component';
import { PostComponent } from './components/post/post.component';
import { ListOfCommentsComponent } from './components/list-of-comments/list-of-comments.component';
import { AddCommentComponent } from './components/add-comment/add-comment.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    LoginComponent,
    ListOfUsersComponent,
    AddPostComponent,
    SearchComponent,
    DeletePostComponent,
    EditPostComponent,
    HeaderComponent,
    FooterComponent,
    UserProfileComponent,
    ErrorMessageComponent,
    ListOfPostsComponent,
    ViewComponent,
    LoaderComponent,
    CreateViewComponent,
    PostComponent,
    ListOfCommentsComponent,
    AddCommentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [AuthService, PostService, ViewService, AuthGuard,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
