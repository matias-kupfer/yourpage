import {Component, Inject, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AuthService} from './core/services/auth.service';
import {FirestoreService} from './core/services/firestore.service';
import {User} from './interfaces/user';
import {Observable} from 'rxjs';
import {isEmpty} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'yourpage | By: Matias Kupfer';
  localStorageUser: User = JSON.parse(localStorage.getItem('user'));

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
  ) {
  }

  ngOnInit(): void {
    console.log('init app')
    if (this.localStorageUser) {
      console.log('init if')
      this.firestoreService.getUserById(this.localStorageUser.personalInfo.userId)
        .onSnapshot(doc => {
          if (doc.data()) {
            const updatedUser: User = doc.data() as User;
            this.authService.saveUserData(updatedUser);
          }
        });
    }
  }
}
