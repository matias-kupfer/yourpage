import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {MatDialog} from '@angular/material';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {User} from '../../interfaces/user';
import {FirestoreService} from '../../core/services/firestore.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {UpdateUserDataService} from '../../core/services/update-user-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userId: User = JSON.parse(localStorage.getItem('user')) || {} as User;
  userData$: Observable<any> = this.firestoreService.getUserById(this.userId.personalInfo.userId);
  userData: User = null;
  isSetUp: boolean;

  private destroy$ = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getUser();
  }

  public getUser() {
    this.userData$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((updatedUser: User) => {
      this.userData = updatedUser;
      this.isSetUp = updatedUser.personalInfo.setUp;
      this.authService.saveUserData(updatedUser);
    });
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
      this.getUser();
    });
  }

  public updateUserInfo(newValues: User) {
    this.userData = newValues;
    console.log('data result from dialog: ', this.userData);
    this.firestoreService.updateUserData(newValues);
  }

  // @todo loader while profile loads
  // @todo if firestore observable doesnt return, user doesnt exist, -> login page
}
