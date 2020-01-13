import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from './core/services/auth.service';
import {FirestoreService} from './core/services/firestore.service';
import {User} from './interfaces/user';
import {SnackbarService} from './core/services/snackbar.service';
import {MatSnackBar} from '@angular/material';
import {Router, RouterLink} from '@angular/router';
import {SnackbarData} from './interfaces/snackbarData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'yourpage | By: Matias Kupfer';
  localStorageUser: User = JSON.parse(localStorage.getItem('user'));

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private notificationService: SnackbarService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.notificationService.notification$.subscribe((snackbarData: SnackbarData) => {
      this.snackBar.open(snackbarData.message, 'snackbarData.button', {
        duration: 4000,
      })/*.afterDismissed().subscribe(() => {
        this.router.navigate([snackbarData.action]);
      });*/
    });
  }

  ngOnInit(): void {
    if (this.localStorageUser) {
      this.firestoreService.getUserById(this.localStorageUser.personalInfo.userId)
        .onSnapshot(doc => {
          if (doc.data()) {
            const updatedUser: User = doc.data() as User;
            this.authService.saveUserData(updatedUser);
          }
        });
    }
  }
}
