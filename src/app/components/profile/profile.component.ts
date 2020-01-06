import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {MatDialog} from '@angular/material';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {User} from '../../interfaces/user';
import {FirestoreService} from '../../core/services/firestore.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userData: User = JSON.parse(localStorage.getItem('user')) || {} as User;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
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
    this.userData = newValues;
    console.log('data result from dialog: ', this.userData);
    this.firestoreService.updateUserData(newValues);
}
}
