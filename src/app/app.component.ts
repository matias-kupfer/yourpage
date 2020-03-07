import {Component, Inject, NgZone, OnInit} from '@angular/core';
import {DefaultRoutes} from './enums/default.routes';
import {AuthService} from './core/services/auth.service';
import {FirestoreService} from './core/services/firestore.service';
import {User} from './class/user';
import {SnackbarService} from './core/services/snackbar.service';
import {MatSnackBar} from '@angular/material';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NotificationData} from './interfaces/notificationData';
import {fadeAnimation} from './interfaces/routeAnimation';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {NewPostSelectorComponent} from './components/new-post/new-post-selector/new-post-selector.component';
import {SideNavActions, SideNavLinks} from './interfaces/sideNavLinks';

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

  public onLogout() {
    this.authService.onLogout();
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
        action: 'openNewPostSelector',
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
