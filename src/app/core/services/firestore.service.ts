import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentData} from '@angular/fire/firestore';
import {User} from '../../interfaces/user';
import {AuthService} from './auth.service';
import * as firebase from 'firebase';
import DocumentReference = firebase.firestore.DocumentReference;
import {Pointer} from '../../interfaces/pointer';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  public db = firebase.firestore();
  user: User = JSON.parse(localStorage.getItem('user')) || {} as User;

  constructor(
    public afs: AngularFirestore,
    private authService: AuthService,
  ) {
  }

  public updateUserData(user: User) {
    return this.afs.collection('users').doc(user.personalInfo.userId).update(user);
  }

  public getUserById(userId: string): DocumentReference<any> {
    return this.db.collection('users').doc(userId);
  }

  public getUserByUserName(userName: string): DocumentData {
    return this.db.collection('users')
      .where('accountInfo.userName', '==', userName).limit(1);
  }

  public updateBioFirestore(newBio: string) {
    this.db.collection('users').doc(this.user.personalInfo.userId)
      .update({'accountInfo.bio': newBio});
  }

  public updateSocialLinks(newLinks: any) {
    this.db.collection('users').doc(this.user.personalInfo.userId)
      .update({'accountInfo.socialLinks': newLinks});
  }

  public addMapPointer(newPointer: Pointer) {
    this.db.collection('users').doc(this.user.personalInfo.userId).update({
      'accountInfo.mapPointers': firebase.firestore.FieldValue.arrayUnion(newPointer)
    });
  }

  public deleteMapPointer(newPointer: Pointer) {
    this.db.collection('users').doc(this.user.personalInfo.userId).update({
      'accountInfo.mapPointers': firebase.firestore.FieldValue.arrayRemove(newPointer)
    });
  }
}
