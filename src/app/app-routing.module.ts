import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ListOfUsersComponent } from './components/list-of-users/list-of-users.component';
import { AuthGuard } from './auth.guard';
import { SearchComponent } from './components/search/search.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SubtidderComponent } from './components/subtidder/subtidder.component';
import { CreateSubtidderComponent } from './components/create-subtidder/create-subtidder.component';
import { PostComponent } from './components/post/post.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '', pathMatch: 'full' },

  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: 'u', component: ListOfUsersComponent, canActivate: [AuthGuard] },
  { path: 'u/:username', component: UserProfileComponent, canActivate: [AuthGuard] },

  { path: 't/:subtidder', component: SubtidderComponent },
  { path: 't/comments/:id', component: PostComponent },
  // { path: 't/:subtidder/comments/:id/', component: PostComponent },
  { path: 'subtidders/create', component: CreateSubtidderComponent, canActivate: [AuthGuard] },

  { path: 'search', component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
