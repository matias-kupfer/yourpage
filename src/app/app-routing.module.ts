import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/loginAndsignup/login/login.component';
import {AuthenticationGuard} from './core/guards/auth.guard';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {ProfileComponent} from './components/profile/profile.component';
import {SignupComponent} from './components/loginAndsignup/signup/signup.component';
import {UsersListComponent} from './components/users-list/users-list.component';
import {NewUserDataComponent} from './components/profile/new-user-data/new-user-data.component';


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthenticationGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard]},
  {path: 'u/:userName', component: ProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'users', component: UsersListComponent, canActivate: [AuthenticationGuard]},

  {path: 'login', component: LoginComponent, canActivate: [AuthenticationGuard]},
  {path: 'signup', component: SignupComponent, canActivate: [AuthenticationGuard]},
  {path: 'configure-profile', component: NewUserDataComponent, canActivate: [AuthenticationGuard]},

  {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard]},

  {path: '**', redirectTo: '/not-found', pathMatch: 'full', canActivate: [AuthenticationGuard]},
  {path: 'not-found', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
