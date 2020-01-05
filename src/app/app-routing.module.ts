import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {AuthenticationGuard} from './core/guards/auth.guard';
import {NotFoundComponent} from './components/not-found/not-found.component';


const routes: Routes = [
  {
    path: '', canActivate: [AuthenticationGuard], children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeComponent},
    ]
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},

  {path: '**', redirectTo: '/not-found', pathMatch: 'full'},
  {path: 'not-found', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
// @todo fix empty path when userlogeding = false
