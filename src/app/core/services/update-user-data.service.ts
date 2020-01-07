import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {User} from '../../interfaces/user';
import {FirestoreService} from './firestore.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateUserDataService {
  public userData: User = JSON.parse(localStorage.getItem('user')) || {} as User;

  constructor(
    private authService: AuthService,
    private afs: FirestoreService
  ) {
  }

  updateUserData(): Observable<any> {
    return this.afs.getUserById(this.userData.personalInfo.userId);
  }
  // @todo this is useless :)
}
