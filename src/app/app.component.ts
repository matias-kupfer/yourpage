import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from './core/services/auth.service';
import {FirestoreService} from './core/services/firestore.service';
import {User} from './interfaces/user';
import {SnackbarService} from './core/services/snackbar.service';
import {MatSnackBar} from '@angular/material';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NotificationData} from './interfaces/notificationData';
import {fadeAnimation} from './interfaces/routeAnimation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeAnimation
  ]
})
export class AppComponent implements OnInit {
  title = 'yourpage | By: Matias Kupfer';
  localStorageUser: User = JSON.parse(localStorage.getItem('user'));

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private notificationService: SnackbarService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.notificationService.notification$.subscribe((notificationData: NotificationData) => {
      this.snackBar.open(notificationData.message, notificationData.button, {
        duration: 4000,
      }).afterDismissed().subscribe(() => {
        if (notificationData.action) {
          this.router.navigate([notificationData.action]);
        }
      });
    });
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
  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
