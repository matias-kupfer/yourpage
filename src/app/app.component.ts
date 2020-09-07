import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
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
import {NewImagePostComponent} from './components/posts/new-image-post/new-image-post.component';
import {UsersListComponent} from './components/profile/users-list/users-list.component';
import {MediaMatcher} from '@angular/cdk/layout';
import {DefaultRoutes} from './enums/default.routes';
import {NotifierService} from 'angular-notifier';
import {MapsService} from './core/services/maps.service';


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
  public sideNavStatus = true;
  private notifier: NotifierService;

  mobileQuery: MediaQueryList;
  public readonly mobileQueryListener: () => void;

  constructor(
    public authService: AuthService,
    private firestoreService: FirestoreService,
    private notificationService: SnackbarService,
    private snackBar: MatSnackBar,
    private router: Router,
    notifier: NotifierService,
    private ngZone: NgZone,
    public dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    this.notifier = notifier;
    // Sidenav responsive
    this.mobileQuery = media.matchMedia('(max-width: 1400px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);

    // Notifications
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
    this.authService.onLogout().then(() => {
      this.router.navigate([DefaultRoutes.OnLogOut]);
      this.notifier.notify('default', 'Successfully logged out');
    }).catch(e => console.log(e));
  }

  public editProfile() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '700px',
      data: this.userData,
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

  // Statistics
  public seeFollowers(userData: User) {
    const dialogRef = this.dialog.open(UsersListComponent, {
      data: userData,
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
        hideResponsive: false,
      },
      {
        matIcon: 'edit',
        iconColor: '#EF0093',
        text: 'New Post',
        action: 'openNewPostSelector',
        hideResponsive: true,
      },
      {
        matIcon: 'power_settings_new',
        iconColor: '#D51B1B',
        text: 'Logout',
        action: 'onLogout',
        hideResponsive: false,
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
        text: 'Access',
        componentName: 'authenticate'
      },
    ];
  }
}
