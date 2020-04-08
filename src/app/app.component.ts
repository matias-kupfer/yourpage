import {Component, NgZone, OnInit} from '@angular/core';
import {AuthService} from './core/services/auth.service';
import {FirestoreService} from './core/services/firestore.service';
import {User} from './class/user';
import {SnackbarService} from './core/services/snackbar.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {NotificationData} from './interfaces/notificationData';
import {fadeAnimation} from './interfaces/routeAnimation';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {SideNavActions, SideNavLinks} from './interfaces/sideNavLinks';
import {EditProfileComponent} from './components/profile/edit-profile/edit-profile.component';
import {NewImagePostComponent} from './components/new-post/new-image-post/new-image-post.component';
import {ChangePictureComponent} from './components/profile/change-picture/change-picture.component';
import {UsersListComponent} from './components/profile/users-list/users-list.component';

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
  navigationLinks: SideNavLinks[];
  navigationLinksNotLoggedIn: SideNavLinks[];
  actions: SideNavActions[];

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private notificationService: SnackbarService,
    private snackBar: MatSnackBar,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private ngZone: NgZone,
    public dialog: MatDialog,
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
    this.sideNavInit();
  }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  openNewPostSelector(): void {
    const dialogRef = this.dialog.open(NewImagePostComponent, {
      width: '700px',
      data: this.userData
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

  public onLogout() {
    this.authService.onLogout();
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
        this.updateUserData(result);
      }
    });
  }

  public updateUserData(updatedUser: User) {
    this.firestoreService.updateUserData(updatedUser).then(res => console.log(res));
  }

  // EDIT PROFILE PICTURE
  public editProfilePicture() {
    const dialogRef = this.dialog.open(ChangePictureComponent, {
      width: '500px',
      data: this.userData,
    });
  }

  // Statistics
  public seeFollowers(userData: User) {
    const dialogRef = this.dialog.open(UsersListComponent, {
      data: userData
    });
  }

  public sideNavInit() {
    this.navigationLinks = [
      {
        matIcon: 'home',
        iconColor: '$primary',
        text: 'Yourpage',
        componentName: 'home'
      },
      {
        matIcon: 'people',
        iconColor: '#C136CC',
        text: 'Users',
        componentName: 'users'
      },
      {
        matIcon: 'person',
        iconColor: '#319A66',
        text: 'Profile',
        componentName: 'profile'
      },
      {
        matIcon: 'search',
        iconColor: '#3664BA',
        text: 'Search',
        componentName: 'search'
      },
    ];

    this.actions = [
      {
        matIcon: 'settings',
        iconColor: '#DDD51C',
        text: 'Edit Profile',
        action: 'editProfile',
      },
      {
        matIcon: 'edit',
        iconColor: '#EF0093',
        text: 'New Post',
        action: 'openNewPostSelector',
      },
      {
        matIcon: 'power_settings_new',
        iconColor: '#D51B1B',
        text: 'Logout',
        action: 'onLogout',
      }
    ];

    this.navigationLinksNotLoggedIn = [
      {
        matIcon: 'home',
        iconColor: '$primary',
        text: 'Yourpage',
        componentName: 'home'
      },
      {
        matIcon: 'people',
        iconColor: '#C136CC',
        text: 'Users',
        componentName: 'users'
      },
      {
        matIcon: 'search',
        iconColor: '#3664BA',
        text: 'Search',
        componentName: 'search'
      },
      {
        matIcon: 'vpn_key',
        iconColor: '#319A66',
        text: 'Login',
        componentName: 'login'
      },
      {
        matIcon: 'person_add',
        iconColor: '#D85921',
        text: 'Register',
        componentName: 'signup'
      },
    ];
  }
}
