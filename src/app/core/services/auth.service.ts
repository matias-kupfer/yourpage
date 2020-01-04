import {Injectable, NgZone} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {DefaultRoutes} from '../../enums/default.routes';
import {Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {User} from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userData: User = JSON.parse(localStorage.getItem('user')) || {} as User;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
  ) {
  }

  public signInWithGoogle() {
    return this.authLogin(new firebase.auth.GoogleAuthProvider());
  }

  public authLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate([DefaultRoutes.OnLogin]);
        });

        this.persistUserData(
          this.createUserDataFromFirebase(result.user)
        );
        this.saveUserData(this.userData);

      }).catch(this.showError);
  }

  public persistUserData(user: User) {
    // save in FireBase
    // @ts-ignore
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.userId}`);
    return userRef.set(user, {
      merge: true
    });
  }

  private createUserDataFromFirebase(firebaseUser: firebase.User): User {
    return this.userData = {
      userId: firebaseUser.uid,
      name: firebaseUser.displayName,
      email: firebaseUser.email,
      imageUrl: firebaseUser.photoURL,
    } as any; // should be as User but it show error
  }

  private saveUserData(user: User) {
    // save in Property of AuthService
    this.userData = user;

    // save in local storage so it's still available when we reload, open new tab, come next day...
    localStorage.setItem('user', JSON.stringify(user));
  }

  private showError = (error) => {
    // @todo here you control the error message
    console.error('error', error);
    window.alert(error.error);
  };

  public get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true : false;
  }

  public onLogout() {
    return this.afAuth.auth.signOut().then(() => {
      this.router.navigate([DefaultRoutes.OnLogout]);
    });
  }
}
