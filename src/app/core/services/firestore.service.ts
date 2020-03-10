import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument, DocumentData} from '@angular/fire/firestore';
import {User} from '../../class/user';
import * as firebase from 'firebase';
import {Pointer} from '../../interfaces/pointer';
import {UploadFile} from '../../class/uploadFile';
import {NotifierService} from 'angular-notifier';
import {ImagePost} from '../../class/imagePost';
import {Reference} from '@angular/fire/storage/interfaces';
import {BehaviorSubject} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import CollectionReference = firebase.firestore.CollectionReference;
import QuerySnapshot = firebase.firestore.QuerySnapshot;
import OrderByDirection = firebase.firestore.OrderByDirection;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  public db = firebase.firestore();
  public storageRef = firebase.storage().ref();
  public imagePosts$: BehaviorSubject<ImagePost[]> = new BehaviorSubject<ImagePost[]>([]);
  public postsOrder$: BehaviorSubject<OrderByDirection> = new BehaviorSubject<OrderByDirection>('desc');
  public userId: string = null;
  private notifier: NotifierService;
  readonly storageImgRef: string[] = ['/images/profileImage/', '/images/posts/'];
  x: ImagePost[] = [];

  constructor(notifier: NotifierService, fireAuth: AngularFireAuth) {
    this.notifier = notifier;
    fireAuth.user.subscribe(user => {
      if (user !== null) {
        this.userId = user.uid;
        this.imagePostSubscription();
        this.postsOrder$.subscribe(() => {
          this.imagePostSubscription();
        });
      }
    });

  }

  public imagePostSubscription(): void {
    this.getPostsByUserId(this.userId)
      .onSnapshot((res: QuerySnapshot<ImagePost>) => {
        if (res) {
          this.imagePosts$.next([]);
          res.forEach(post => this.imagePosts$.next(this.imagePosts$.getValue().concat(post.data())));
        }
      });
  }

  public getUserById(userId: string): DocumentData {
    return this.db.collection('users').doc(userId);
  }

  public getPostsByUserId(userId: string): DocumentData {
    return this.db.collection('users').doc(userId).collection('posts')
      .orderBy('date', this.postsOrder$.getValue()).limit(3);
  }

  public getUserByUserName(userName: string): DocumentData {
    return this.db.collection('users')
      .where('accountInfo.userName', '==', userName).limit(1);
  }

  public updateUserData(user: User): Promise<void> {
    return this.db.collection('users').doc(user.personalInfo.userId).set(user, {
      merge: true
    });
  }

  public updatePost(imagePost: ImagePost, user: User): Promise<void> {
    return this.db.collection('users').doc(user.personalInfo.userId)
      .collection('posts').doc(imagePost.postId).set(imagePost, {
        merge: true
      });
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

  public newImagePost(newImagePost: ImagePost, images: UploadFile[], user: User): Promise<void> {
    return this.db.collection(`users/${user.personalInfo.userId}/posts`).add(newImagePost)
      .then(response => {
        newImagePost.postId = response.id;
        newImagePost.date = new Date();
        return this.uploadImagesFireStorage(images, user, newImagePost);
      }).catch((e) => {
        console.error(e);
        this.notifier.notify('warning', 'Error trying to save post to subcollection');
      });
  }

  public deleteImagePost(imagePostToDelete: ImagePost): Promise<void> {
    return this.db.collection('users').doc(this.userId).collection('posts').doc(imagePostToDelete.postId).delete()
      .then(() => {
        for (let i = 0; i < imagePostToDelete.imagesUrls.length; i++) {
          const deleteRef: Reference = this.storageRef.child(`users/${this.userId}${this.storageImgRef[1]}${imagePostToDelete.postId}/${i}`);
          this.deleteFileFirebase(deleteRef).catch(error => console.log(error));
        }
      });
  }
// todo notify success delete
  async deleteFileFirebase(path: Reference): Promise<any> {
    return await path.delete();
  }


  async uploadImagesFireStorage(images: UploadFile[], user: User, newImagePost: ImagePost = null) {
    // let uploadTask: firebase.storage.UploadTask;
    let uploadTask: Reference;
    let index = 0;
    for (const image of images) {
      image.uploading = true;
      if (image.progress >= 100) {
        continue;
      }
      if (newImagePost === null) { // update profile picture
        uploadTask = this.storageRef.child(`users/${user.personalInfo.userId}${this.storageImgRef[0]}${user.personalInfo.userId}`);
      }
      if (newImagePost) { // new image post
        uploadTask = this.storageRef.child(`users/${user.personalInfo.userId}${this.storageImgRef[1]}${newImagePost.postId}/${index}`);
      }

      await uploadTask.put(image.file).then((snapshot: firebase.storage.UploadTaskSnapshot) => {
        image.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        snapshot.ref.getDownloadURL().then(
          (response: any) => {
            image.url = response;
            image.uploading = false;
            if (newImagePost === null) {
              user.accountInfo.imageUrl = image.url;
              this.updateUserData(user);
            }
            if (newImagePost) {
              newImagePost.imagesUrls.push(image.url);
              this.updatePost(newImagePost, user);
            }
          }
        );
      }).catch((e) => {
        this.notifier.notify('default', 'Error uploading file');
        console.log(e);
      });

      /*uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot: firebase.storage.UploadTaskSnapshot) => {
          image.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        }, (e) => this.notifier.notify('default', 'Error uploading file'),
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(
            (response: any) => {
              console.log(response);
              image.url = response;
              image.uploading = false;
              if (newImagePost === null) {
                user.accountInfo.imageUrl = image.url;
                this.updateUserData(user);
              }
              if (newImagePost) {
                newImagePost.imagesUrls.push(image.url);
                this.updatePost(newImagePost, user);
              }
            }
          );
        });*/
      index++;
    }
  }
}
