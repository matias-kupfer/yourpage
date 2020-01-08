import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {User} from '../../interfaces/user';
import {AuthService} from './auth.service';
import * as firebase from 'firebase';
import DocumentReference = firebase.firestore.DocumentReference;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  public db = firebase.firestore();
  userId: User = JSON.parse(localStorage.getItem('user')) || {} as User;

  constructor(
    public afs: AngularFirestore,
    private authService: AuthService,
  ) {
  }

  public updateUserData(user: User) {
    /*this.authService.saveUserData(user);*/
    return this.afs.collection('users').doc(user.personalInfo.userId).update(user);
  }

  public getUserById(userId: string): DocumentReference<any> {
    /*return this.afs.doc(`users/${userId}`).snapshotChanges().pipe(take(1));*/
    return this.db.collection('users').doc(userId);
  }
}