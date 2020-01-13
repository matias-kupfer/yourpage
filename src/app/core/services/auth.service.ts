import {Injectable, NgZone} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {DefaultRoutes} from '../../enums/default.routes';
import {Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument, DocumentData, DocumentSnapshot} from '@angular/fire/firestore';
import {User} from '../../interfaces/user';
import {SnackbarService} from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public db = firebase.firestore();
  public userData: User = JSON.parse(localStorage.getItem('user'));

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private notificationService: SnackbarService
  ) {
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
          this.saveUserDataToFirebase(finalUser);
          this.saveUserData(finalUser);
          this.notificationService.notification$.next({message: 'Registered', button: null});
        } else if (!result.additionalUserInfo.isNewUser && !newUserData) { // user log in
          const userId: User = {personalInfo: {userId: result.user.uid}} as User; // look this up in future
          this.saveUserData(userId);
          this.notificationService.notification$.next({message: 'Logged in', button: 'Dismiss'});
          /*this.getUserById(result.user.uid)
            .subscribe(res => {
              console.log(res.data());
              this.saveUserData(res.data() as User)
            });*/
        } else if (result.additionalUserInfo.isNewUser && !newUserData) { // not working
          this.notificationService.notification$.next(
            {message: 'The user is not registered', button: 'Dismiss'});
        } else if (!result.additionalUserInfo.isNewUser && newUserData) {
          this.notificationService.notification$.next(
            {message: 'User alredy registered.', button: 'Login', action: '/login'});
        }

      }).catch(this.showError);
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
    // save in Property of AuthService
    this.userData = user;

    // save in local storage so it's still available when we reload, open new tab, come next day...
    localStorage.setItem('user', JSON.stringify(user));
  }

  private showError = (error) => {
    // @todo here you control the error message
    console.error('error', error);
    window.alert(error.error);
  }

  public get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  public getUserById(userId: string = this.userData.personalInfo.userId): DocumentData {
    return this.db.collection('users').doc(userId);
  }

  public onLogout() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.clear();
      this.router.navigate([DefaultRoutes.OnLogOut]);
    });
  }
}
