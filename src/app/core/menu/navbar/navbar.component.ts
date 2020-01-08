import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DefaultRoutes} from '../../../enums/default.routes';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public menus: { name: string, key: string }[] = [];
  public onLoginButtonClick: string = DefaultRoutes.OnLoginButtonClick;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.menus = [
      {name: 'Home', key: 'home'},
      /*{name: 'Profile', key: 'profile'},*/
    ];
  }

  public onLogout() {
    this.authService.onLogout();
  }

}
