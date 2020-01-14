import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {MatDialog} from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {User} from '../../interfaces/user';
import {FirestoreService} from '../../core/services/firestore.service';
import {ActivatedRoute} from '@angular/router';
import {SnackbarService} from '../../core/services/snackbar.service';
import {Subject} from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userData: User = null;
  public userName = this.route.snapshot.paramMap.get('userName');

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private notificationService: SnackbarService) {
  }

  ngOnInit() {
    if (this.userName) {
      this.getUserByUsername();
    } else {
      this.authService.user$.subscribe((doc) => {
        this.userData = doc;
        console.log(doc);
      });
    }
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

  // @todo loader while profile loads
  // @todo if firestore observable doesnt return, user doesnt exist, -> login page
}
