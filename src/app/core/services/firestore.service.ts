import {forwardRef, inject, Inject, Injectable, NgZone} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument, DocumentData} from '@angular/fire/firestore';
import {User} from '../../class/user';
import {AuthService} from './auth.service';
import * as firebase from 'firebase';
import {Pointer} from '../../interfaces/pointer';
import {UploadFile} from '../../class/uploadFile';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  public db = firebase.firestore();
  public storageRef = firebase.storage().ref();
  public storageProfileImageReference = 'images/profileImages/';

  constructor() {
  }

  public updateUserData(user: User) {
    this.db.collection('users').doc(user.personalInfo.userId).set(user, {
      merge: true
    });
  }

  public getUserByUserName(userName: string): DocumentData {
    return this.db.collection('users')
      .where('accountInfo.userName', '==', userName).limit(1);
  }

  public addMapPointer(newPointer: Pointer, userId: string) {
    this.db.collection('users').doc(userId).update({
      'accountInfo.mapPointers': firebase.firestore.FieldValue.arrayUnion(newPointer)
    });
  }

  public deleteMapPointer(newPointer: Pointer, userId: string) {
    this.db.collection('users').doc(userId).update({
      'accountInfo.mapPointers': firebase.firestore.FieldValue.arrayRemove(newPointer)
    });
  }

  public getAllUsers() {
    return this.db.collection('users');
  }

  public getUserById(userId: string): DocumentData {
    return this.db.collection('users').doc(userId);
  }

  public uploadImagesFirebase(images: UploadFile[], user: User) {
    // path to save location as parameter so this can be used to upload any type of picture
    for (const item of images) {
      item.uploading = true;
      if (item.progress >= 100) {
        continue;
      }
      const uploadTask: firebase.storage.UploadTask =
        this.storageRef.child(`${this.storageProfileImageReference}${user.personalInfo.userId}`)
          .put(item.file);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) =>
          item.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        (error) => console.error('error on upload ', error),
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(
            (response: any) => {
              item.url = response;
              item.uploading = false;
              user.accountInfo.imageUrl = item.url;
              this.updateUserData(user);
            }
          );
        });
    }
  }
}
