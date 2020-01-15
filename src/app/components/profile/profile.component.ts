import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from '../../interfaces/user';
import {FirestoreService} from '../../core/services/firestore.service';
import {ActivatedRoute} from '@angular/router';
import {SnackbarService} from '../../core/services/snackbar.service';
import {NotifierService} from 'angular-notifier';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userData: User = null;
  public userName = this.route.snapshot.paramMap.get('userName');
  private notifier: NotifierService;


  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private notificationService: SnackbarService,
    notifier: NotifierService,
    private ngZone: NgZone) {
    this.notifier = notifier;
  }

  ngOnInit() {
    if (this.userName) {
      this.getUserByUsername();
    } else {
      this.userDataSubscription();
    }
  }

  userDataSubscription() {
    this.authService.user$
      .subscribe((doc) => {
        this.ngZone.run(() => {
          this.userData = doc;
        });
      });
  }

  public getUserByUsername() {
    this.firestoreService.getUserByUserName(this.userName)
      .onSnapshot((doc) => {
        if (doc.docs[0]) {
          const updatedUser: User = doc.docs[0].data();
          this.userData = updatedUser;
        }
      });
  }

  // @todo loader while profile loads
  // @todo if firestore observable doesnt return, user doesnt exist, -> login page
}
