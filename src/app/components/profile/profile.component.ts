import {AfterViewInit, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from '../../interfaces/user';
import {FirestoreService} from '../../core/services/firestore.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SnackbarService} from '../../core/services/snackbar.service';
import {NotifierService} from 'angular-notifier';
import {MatDialog} from '@angular/material';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {error} from 'util';
import {DefaultRoutes} from '../../enums/default.routes';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userData: User = null;
  public userName = this.route.snapshot.paramMap.get('userName');
  public isUserProfile = true;
  private notifier: NotifierService;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public router: Router,
    private notificationService: SnackbarService,
    notifier: NotifierService,
    private ngZone: NgZone,
    public dialog: MatDialog) {
    this.notifier = notifier;
  }

  ngOnInit() {
    if (this.userName) {
      this.isUserProfile = false;
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

  public editProfile() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '700px',
      data: this.userData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.snackBar.open('No changes were made', '', {
          duration: 5000
        });
      } else {
        this.snackBar.open('Profile updated successfuly!', '', {
          duration: 5000
        });
        this.updateBioFirestore(result.bio);
        this.updateSocialLinks(result.socialLinks);
      }
    });
  }

  public updateBioFirestore(newBio: string) {
    this.firestoreService.updateBioFirestore(newBio);
  }

  public updateSocialLinks(newSocialLinks: any) {
    this.firestoreService.updateSocialLinks(newSocialLinks);
  }

  // @todo if firestore observable doesnt return, user doesnt exist, -> login page
}
