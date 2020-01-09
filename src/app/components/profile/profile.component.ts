import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {MatDialog} from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {User} from '../../interfaces/user';
import {FirestoreService} from '../../core/services/firestore.service';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  localStorageUser: User = JSON.parse(localStorage.getItem('user')) as User;
  userData: User = null;
  isProfileOwner = false;
  isSetUp: boolean = null;
  public userName = this.route.snapshot.paramMap.get('userName');

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    // if it's user's profile
    if (this.localStorageUser && this.localStorageUser.accountInfo.userName === this.userName) {
      this.firestoreService.getUserById(this.localStorageUser.personalInfo.userId)
        .onSnapshot(doc => {
          if (doc.data()) {
            const updatedUser: User = doc.data() as User;
            this.userData = updatedUser;
            this.isSetUp = updatedUser.personalInfo.setUp;
            this.isProfileOwner = true;
          }
        });
    } else { // visitor. NOT profile owner
      this.firestoreService.getUserByUserName(this.userName)
        .onSnapshot((doc) => {
          if (doc.docs[0].data()) {
            const updatedUser: User = doc.docs[0].data();
            this.userData = updatedUser;
          }
        });
    }
  }

  public newUserData() {
    // move here getter
  }

  public editProfile() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: 'auto',
      data: {userData: this.userData}
    });

    dialogRef.afterClosed().subscribe((result: User) => {
      if (!result) {
        this.snackBar.open('Canceled', 'Dismiss', {
          duration: 4000,
        });
        return;
      }
      if (JSON.stringify(result) === JSON.stringify({})) {
        this.snackBar.open('No changes', 'Dismiss', {
          duration: 4000,
        });
        return;
      }
      this.updateUserInfo(result);
    });
  }

  public updateUserInfo(newValues: User) {
    this.firestoreService.updateUserData(newValues).then(
      (response) => {
        this.snackBar.open('Changes saved', 'Dismiss', {
          duration: 4000,
        });
        this.newUserData();
      }, (error) => {
        console.error(error);
        this.snackBar.open('Error', 'Dismiss', {
          duration: 4000,
        });
      });
    // @todo use response for snackbar message
  }

  // @todo loader while profile loads
  // @todo if firestore observable doesnt return, user doesnt exist, -> login page
}
