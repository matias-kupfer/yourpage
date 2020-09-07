import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {AuthenticateComponent} from './components/authenticate/authenticate.component';
import {AuthenticationGuard} from './core/guards/auth.guard';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {ProfileComponent} from './components/profile/profile.component';
import {UsersComponent} from './components/users/users.component';
import {NewUserDataComponent} from './components/profile/new-user-data/new-user-data.component';
import {SearchComponent} from './components/search/search.component';


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthenticationGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard]},
  {path: 'u/:userName', component: ProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'users', component: UsersComponent, canActivate: [AuthenticationGuard]},

  {path: 'authenticate', component: AuthenticateComponent, canActivate: [AuthenticationGuard]},
  {path: 'configure-profile', component: NewUserDataComponent, canActivate: [AuthenticationGuard]},

  {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard]},

  {path: 'search', component: SearchComponent, canActivate: [AuthenticationGuard]},

  {path: '**', redirectTo: '/not-found', pathMatch: 'full', canActivate: [AuthenticationGuard]},
  {path: 'not-found', component: NotFoundComponent, canActivate: [AuthenticationGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
