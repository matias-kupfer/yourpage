import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {DefaultRoutes} from '../../enums/default.routes';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn) {
      if (state.url === '/login' || state.url === '/register') {
        this.router.navigate([DefaultRoutes.OnDefault]);
        return false;
      }
      /*if (!this.authService.userData.personalInfo.setUp && state.url !== '/profile') {
        this.router.navigate([DefaultRoutes.OnNotSetUp]);
        return false;
      }*/
      return true;
    }
    return true;
  }
}
