import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DefaultRoutes} from '../../../enums/default.routes';
import {User} from '../../../class/user';
import {FirestoreService} from '../../services/firestore.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public onLoginButtonClick: string = DefaultRoutes.OnLoginButtonClick;
  public onSignUpButtonClick: string = DefaultRoutes.OnSignupButtonClick;
  public onProfileButtonClick: string = DefaultRoutes.OnProfileButtonClick;

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
  }

  public onLogout() {
    this.authService.onLogout();
  }

}
