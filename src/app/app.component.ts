import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from './core/services/auth.service';
import {FirestoreService} from './core/services/firestore.service';
import {User} from './interfaces/user';
import {SnackbarService} from './core/services/snackbar.service';
import {MatSnackBar} from '@angular/material';

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
    private snackBar: MatSnackBar
  ) {
    this.notificationService.notification$.subscribe(snackbar => {
      this.snackBar.open(snackbar.message, snackbar.button, {
        duration: 4000,
      });
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
