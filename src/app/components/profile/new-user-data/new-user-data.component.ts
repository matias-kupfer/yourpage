import {Component, NgZone, OnInit} from '@angular/core';
import {User} from '../../../class/user';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../../core/services/auth.service';
import {DefaultRegex} from '../../../enums/regex.enum';
import {debounceTime, map, take} from 'rxjs/operators';
import {countryList} from '../../../enums/countries.enum';
import {MatDatepicker} from '@angular/material';
import {FirestoreService} from '../../../core/services/firestore.service';
import {Router} from '@angular/router';
import {DefaultRoutes} from '../../../enums/default.routes';
import {UploadFile} from '../../../class/uploadFile';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-user-data',
  templateUrl: './new-user-data.component.html',
  styleUrls: ['./new-user-data.component.scss']
})
export class NewUserDataComponent implements OnInit {
  countryList: any[] = countryList;
  userData: User;
  hover = false;
  files: UploadFile[] = [];
  uploading = false;

  personalForm: FormGroup;
  accountForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private afs: AngularFirestore,
              private authService: AuthService,
              public firestoreService: FirestoreService,
              public router: Router,
              private ngZone: NgZone,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.authService.user$
      .subscribe((doc) => {
        this.ngZone.run(() => {
          this.userData = doc;
        });
      });

    this.personalForm = new FormGroup({
      name: new FormControl(this.userData.personalInfo.name, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
        Validators.pattern(DefaultRegex.default),
      ]),
      lastName: new FormControl(this.userData.personalInfo.lastName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
        Validators.pattern(DefaultRegex.default),
      ]),
      gender: new FormControl('', [Validators.required]),
      birthday: new FormControl('', [Validators.required]),
    });

    this.accountForm = new FormGroup({
      userName: new FormControl('',
        [Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          Validators.pattern(DefaultRegex.userName)],
        UsernameValidator.userName(this.afs),
      ),
      country: new FormControl('', Validators.required),
      bio: new FormControl('', [
        Validators.required,
        Validators.maxLength(200)
      ]),
    });
  }

  public validateDate(date: MatDatepicker<any>) {
    console.log(date);
  }

  get name() {
    return this.personalForm.get('name');
  }

  get lastName() {
    return this.personalForm.get('lastName');
  }

  get gender() {
    return this.personalForm.get('gender');
  }

  get birthday() {
    return this.personalForm.get('birthday');
  }

  get userName() {
    return this.accountForm.get('userName');
  }

  get country() {
    return this.accountForm.get('country');
  }

  get bio() {
    return this.accountForm.get('bio');
  }

  saveData() {
    const updatedUser: User = this.userData;
    updatedUser.personalInfo.name = this.name.value;
    updatedUser.personalInfo.lastName = this.lastName.value;
    updatedUser.personalInfo.gender = this.gender.value;
    updatedUser.personalInfo.birthday = this.birthday.value;
    updatedUser.accountInfo.bio = this.bio.value;
    updatedUser.accountInfo.country = this.country.value;
    updatedUser.accountInfo.userName = this.userName.value;
    this.firestoreService.updateUserData(updatedUser);
    this.authService.user$.next(updatedUser);
    this.router.navigate([DefaultRoutes.OnLogin]);
  }

  public onLogout() {
    this.authService.onLogout();
  }

  updateProfileImage() {
    this.uploading = true;
    this.firestoreService.uploadImagesFireStorage(this.files, this.userData).then(() => {
      this.snackBar.open('Profile picture updated successfully', 'dismiss', {
        duration: 5000
      });
      this.uploading = false;
    });
  }

  emptyFiles() {
    this.files = [];
  }

}

export class UsernameValidator {
  static userName(afs: AngularFirestore) {
    return (control: AbstractControl) => {
      const username = control.value.toLowerCase();
      return afs.collection('users', ref => ref.where('accountInfo.userName', '==', username))
        .valueChanges().pipe(
          debounceTime(100), // make sure user stopped writing
          take(1),
          map(arr => arr.length ? {usernameAvailable: false} : null),
        );
    };
  }
}
