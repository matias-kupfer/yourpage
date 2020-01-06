import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {User} from '../../interfaces/user';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    public afs: AngularFirestore,
    private authService: AuthService,
    ) {
  }

  public updateUserData(user: User) {
    this.authService.saveUserData(user);
    return this.afs.collection('users').doc(user.personalInfo.userId).update(user);
  }
}
