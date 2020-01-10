import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DefaultRoutes} from '../../../enums/default.routes';
import {User} from '../../../interfaces/user';
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
  localStorageUser: any = JSON.parse(localStorage.getItem('user'));

  constructor(private authService: AuthService, private firestoreService: FirestoreService) {
  }

  ngOnInit(): void {
    /*if (this.localStorageUser) {
      this.firestoreService.getUserById(this.localStorageUser.personalInfo.userId)
        .onSnapshot(doc => {
          if (doc.data()) {
            const updatedUser: User = doc.data() as User;
            this.authService.saveUserData(updatedUser);
          }
        });
    }*/
  }

  public onLogout() {
    this.authService.onLogout();
  }

}
