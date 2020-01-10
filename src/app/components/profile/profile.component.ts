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
  userData: User = null;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    const userId: User = JSON.parse(localStorage.getItem('user'));
    this.authService.getUserById(userId.personalInfo.userId).get().then(doc => {
      if (doc.data()) {
        this.userData = doc.data();
        this.authService.saveUserData(doc.data());
      }
    });
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
