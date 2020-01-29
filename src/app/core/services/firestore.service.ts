import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentData} from '@angular/fire/firestore';
import {User} from '../../interfaces/user';
import {AuthService} from './auth.service';
import * as firebase from 'firebase';
import DocumentReference = firebase.firestore.DocumentReference;
import {Pointer} from '../../interfaces/pointer';
import {UploadFile} from '../../class/uploadFile';

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

  public getAllUsers() {
    return this.db.collection('users');
  }

  loadImagesFirebase(images: UploadFile[], user: User) {
    const storageRef = firebase.storage().ref();

    for (const item of images) {
      item.uploading = true;
      if (item.progress >= 100) {
        continue;
      }
      const uploadTask: firebase.storage.UploadTask =
        storageRef.child(`/profileImages/${item.fileName}`)
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

