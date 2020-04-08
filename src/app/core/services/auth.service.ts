import {Injectable, NgZone} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {DefaultRoutes} from '../../enums/default.routes';
import {Router} from '@angular/router';
import {User} from '../../class/user';
import {BehaviorSubject, Observable} from 'rxjs';
import {NotifierService} from 'angular-notifier';
import {map} from 'rxjs/operators';
import {FirestoreService} from './firestore.service';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public isSetUp: boolean = null;
  public isLoggedIn: boolean = null;
  private notifier: NotifierService;

  constructor(
    public fireAuth: AngularFireAuth,
    public router: Router,
    public firestoreService: FirestoreService,
    notifier: NotifierService
  ) {
    this.notifier = notifier;
    this.isLoggedInGetter.subscribe(authUser => {
      this.isLoggedIn = authUser;
      if (authUser) {
        this.userDataSubscription();
      }
    });
  }

  async googleAuth() {
    return await this.authLogin(new firebase.auth.GoogleAuthProvider());
  }

  async authLogin(provider) {
    return await this.fireAuth.auth.signInWithPopup(provider)
      .then((result) => {
        if (result) {
          if (result.additionalUserInfo.isNewUser) { // sign up
            this.firestoreService.updateUserData(JSON.parse(JSON.stringify(this.createNewUserObject(result))));
            this.notifier.notify('default', 'Successfully registered as ' + result.user.email);
          } else { // login
            this.userDataSubscription();
            this.notifier.notify('default', 'Welcome back ' + result.user.email);
          }
          this.router.navigate([DefaultRoutes.OnLogin]);
        }
      }).catch((error) => {
        console.log(error);
        this.notifier.notify('warning', 'Error trying to login, check your conexion and try again.');
      });
  }

  public loginWithUserPassword(email: string, password: string) {
    return this.fireAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.userDataSubscription();
        this.notifier.notify('default', 'Welcome back ' + result.user.email);
        this.router.navigate([DefaultRoutes.OnLogin]);
      }).catch(e => {
        this.notifier.notify('warning', e.message);
      });
  }

  async signUpWithUserAndPassword(username: string, lastName: string, email: string, password: string) {
    return await this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // verify it doesnt exist
        console.log(result.user.uid);
        const newEmailUser = new User(result.user.uid, username, lastName, email,
          'https://firebasestorage.googleapis.com/v0/b/yourpage-4e4b4.appspot.com/o/defaultProfilePicture.png?alt=media&token=a69202d2-27ce-4329-a593-09809ac04a8d');
        this.firestoreService.updateUserData(JSON.parse(JSON.stringify(newEmailUser)));
        this.notifier.notify('default', 'Successfully registered as ' + result.user.email);
        this.router.navigate([DefaultRoutes.OnLogin]);
      }).catch(e => {
        this.notifier.notify('warning', e.message);
      });
  }

  public userDataSubscription(): void {
    this.fireAuth.user.subscribe(firebaseUser => {
      if (firebaseUser) {
        this.firestoreService.getUserById(firebaseUser.uid)
          .onSnapshot(res => {
            if (res.data()) {
              this.user$.next(res.data());
            }
          });
      }
    });
  }

  public createNewUserObject(firebaseUser: UserCredential): User {
    // @ts-ignore
    return new User(firebaseUser.user.uid, firebaseUser.additionalUserInfo.profile.given_name,
      // @ts-ignore
      firebaseUser.additionalUserInfo.profile.family_name, firebaseUser.user.email, firebaseUser.user.photoURL);
  }

  public get isLoggedInGetter(): Observable<boolean> {
    return this.fireAuth.authState.pipe(
      map(user => {
        return !!user;
      })
    );
  }

  public async onLogout() {
    await this.fireAuth.auth.signOut();
    this.user$.next(null);
    this.isSetUp = null;
    this.notifier.notify('default', 'Successfully logged out');
    await this.router.navigate([DefaultRoutes.OnLogOut]);
  }
}

// TODO DO unsubscribe on log out
