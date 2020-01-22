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
import {EditPointerComponent} from './edit-pointer/edit-pointer.component';
import {Pointer} from '../../interfaces/pointer';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  userData: User = null;
  public userName = this.route.snapshot.paramMap.get('userName');
  public isUserProfile = true;
  private notifier: NotifierService;
  public pointers: Pointer[] = [];

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

  ngOnDestroy(): void {
    this.snackBar.dismiss();
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


  // MAP
  createPointer(newCoords) {
    const newPointer: Pointer = {
      lat: newCoords.coords.lat,
      lng: newCoords.coords.lng,
      title: 'Title',
      description: 'Add description'
    };
    this.firestoreService.addMapPointer(newPointer);
  }

  editPointer(pointer: Pointer) {
    const dialogRef = this.dialog.open(EditPointerComponent, {
      width: '250px',
      data: {title: pointer.title, description: pointer.description}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.snackBar.open('Edit pointer canceled', '', {
          duration: 5000
        });
        return;
      }
      if (pointer.title === result.title && pointer.description === result.description) {
        this.snackBar.open('No changes were applied', '', {
          duration: 5000
        });
        return;
      }
      // objects inside arrays cant be modified in firestore. so I delete it and create it again
      this.removePointer(pointer);
      pointer.title = result.title;
      pointer.description = result.description;
      this.firestoreService.addMapPointer(pointer);
      this.snackBar.open('Pointer updated succesfully', '', {
        duration: 5000
      });
    });
  }

  removePointer(pointer: Pointer) {
    this.firestoreService.deleteMapPointer(pointer);
  }

  // @todo undo action ?
  // @todo if firestore observable doesnt return, user doesnt exist, -> login page
}
