import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {MatDialog} from '@angular/material';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {User} from '../../interfaces/user';
import {FirestoreService} from '../../core/services/firestore.service';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  localStorageUser: User = JSON.parse(localStorage.getItem('user')) || {} as User;
  userData: User = null;
  isSetUp: boolean;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.localStorageUser) {
      this.userData = this.localStorageUser;
      this.isSetUp = this.localStorageUser.personalInfo.setUp;
    }
  }

  public editProfile() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: 'auto',
      data: {userData: this.userData}
    });

    dialogRef.afterClosed().subscribe((result: User) => {
      if (!result) {
        return;
      }
      this.updateUserInfo(result);
    });
  }

  public updateUserInfo(newValues: User) {
    this.firestoreService.updateUserData(newValues);
  }

  // @todo loader while profile loads
  // @todo if firestore observable doesnt return, user doesnt exist, -> login page
}
