import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {AuthService} from './core/services/auth.service';
import {FirestoreService} from './core/services/firestore.service';
import {User} from './class/user';
import {SnackbarService} from './core/services/snackbar.service';
import {MatSnackBar} from '@angular/material';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NotificationData} from './interfaces/notificationData';
import {fadeAnimation} from './interfaces/routeAnimation';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NewPostSelectorComponent} from './components/new-post-selector/new-post-selector.component';

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
  userData: User = null;
  localStorageUser: User = JSON.parse(localStorage.getItem('user'));

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private notificationService: SnackbarService,
    private snackBar: MatSnackBar,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private ngZone: NgZone,
  ) {
    this.notificationService.notification$.subscribe((notificationData: NotificationData) => {
      this.snackBar.open(notificationData.message, notificationData.button, {
        duration: 4000, /*not working*/
      }).afterDismissed().subscribe(() => {
        if (notificationData.action) {
          this.router.navigate([notificationData.action]);
        }
      });
    });
  }

  ngOnInit(): void {
    this.userDataSubscription();
  }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  openNewPostSelector(): void {
    this.bottomSheet.open(NewPostSelectorComponent, {
      data: this.localStorageUser
    });
  }

  userDataSubscription() {
    this.authService.user$
      .subscribe((doc) => {
        this.ngZone.run(() => {
          this.userData = doc;
        });
      });
  }
}
