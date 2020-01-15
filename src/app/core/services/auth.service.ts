import {Injectable, NgZone} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {DefaultRoutes} from '../../enums/default.routes';
import {Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument, DocumentData, DocumentSnapshot} from '@angular/fire/firestore';
import {User} from '../../interfaces/user';
import {BehaviorSubject, Subject} from 'rxjs';
import {NotifierService} from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public db = firebase.firestore();
  public user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public userData: User = JSON.parse(localStorage.getItem('user'));
  private notifier: NotifierService;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    notifier: NotifierService
  ) {
    this.notifier = notifier;
    if (this.isLoggedIn) {
      this.userDataSubscription(this.userData.personalInfo.userId);
    }
  }

  public googleAuth(newUserData?: User) {
    return this.authLogin(new firebase.auth.GoogleAuthProvider(), newUserData);
  }

  public authLogin(provider, newUserData?: User) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate([DefaultRoutes.OnLogin]);
        });

        if (result.additionalUserInfo.isNewUser && newUserData) { // user sign up
          const finalUser = this.createUserDataFromFirebase(result.user, newUserData);
          this.notifier.notify('default', 'Successfully registered as ' + result.user.email);
          this.saveUserDataToFirebase(finalUser);
          const userId: User = {personalInfo: {userId: result.user.uid}} as User; // look this up in future
          this.saveUserData(userId);
          this.userDataSubscription(result.user.uid);
        } else if (!result.additionalUserInfo.isNewUser && !newUserData) { // user log in
          this.notifier.notify('default', 'Logged in as ' + result.user.email);
          const userId: User = {personalInfo: {userId: result.user.uid}} as User; // look this up in future
          this.saveUserData(userId);
          this.userDataSubscription(result.user.uid);
        } else if (result.additionalUserInfo.isNewUser && !newUserData) { // not working
          /*this.notificationService.notification$.next(
            {message: 'The user is not registered'});*/
        } else if (!result.additionalUserInfo.isNewUser && newUserData) {
          /*this.notificationService.notification$.next(
            {message: 'User alredy registered.'});*/
        }

      }).catch(this.showError);
  }

  public userDataSubscription(userId: string) {
    this.getUserById(userId)
      .onSnapshot(res => {
        this.user$.next(res.data());
        this.saveUserData(res.data());
      });
  }

  public saveUserDataToFirebase(user: User) {
    // save in FireBase
    // @ts-ignore
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.personalInfo.userId}`);
    return userRef.set(user, {
      merge: true
    });
  }

  public createUserDataFromFirebase(firebaseUser: firebase.User, newUserData: User): User {
    newUserData.personalInfo.userId = firebaseUser.uid;
    newUserData.personalInfo.email = firebaseUser.email;
    newUserData.accountInfo.imageUrl = firebaseUser.photoURL;
    newUserData.accountInfo.registrationDate = new Date();
    return newUserData;
  }

  public saveUserData(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private showError = (error) => {
    // @todo here you control the error message
    console.error('error', error);
  };

  public get isLoggedIn(): boolean {
    const user: User = JSON.parse(localStorage.getItem('user'));
    return !!user;
  }

  public getUserById(userId: string = this.userData.personalInfo.userId): DocumentData {
    return this.db.collection('users').doc(userId);
  }

  public onLogout() {
    return this.afAuth.auth.signOut().then(() => {
      this.notifier.notify('default', 'Successfully logged out');
      localStorage.clear();
      this.router.navigate([DefaultRoutes.OnLogOut]);
    });
  }
}
