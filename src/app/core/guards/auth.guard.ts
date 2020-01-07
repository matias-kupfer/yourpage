import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {DefaultRoutes} from '../../enums/default.routes';
import {UpdateUserDataService} from '../services/update-user-data.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private updateUserDataService: UpdateUserDataService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn) {
      if (state.url === '/login') {
        this.router.navigate([DefaultRoutes.OnLogin]);
        return false;
      }
      if (!this.authService.userData.personalInfo.setUp && state.url !== '/profile') {
        this.router.navigate([DefaultRoutes.OnNotSetUp]);
        return false;
      }
      return true;
    }
    // not logged in
    if (state.url !== '/login') {
      this.router.navigate([DefaultRoutes.OnNotLoggedIn]);
    }
    return true;
  }
}
