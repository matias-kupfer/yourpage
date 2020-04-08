import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {User} from '../../../class/user';
import {AppComponent} from '../../../app.component';
import {FirestoreService} from '../../../core/services/firestore.service';
import {SnackbarService} from '../../../core/services/snackbar.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  public followers: User[] = [];
  public following: User[] = [];
  public error = false;

  constructor(public dialogRef: MatDialogRef<AppComponent>,
              private firestoreService: FirestoreService,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) public userData: User) {
  }

  ngOnInit() {
    this.getFollowers();
    this.getFollowing();
  }

  public getFollowers() {
    for (const userId of this.userData.followers) {
      this.firestoreService.getUserById(userId).get().then(user => {
        this.followers.push(user.data());
      }).catch(e => {
        console.log('e');
        this.error = true;
      });
    }
  }

  public getFollowing() {
    for (const userId of this.userData.following) {
      this.firestoreService.getUserById(userId).get().then(user => {
        this.following.push(user.data());
      }).catch(e => {
        console.log('e');
        this.error = true;
      });
    }
  }

  onProfileBtnClick(userName: string) {
    this.router.navigate(['/u/' + userName]);
    this.dialogRef.close();
  }

}
