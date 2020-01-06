import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, take, debounceTime} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {countryList} from '../../../enums/countries.enum';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  countryList: any[] = countryList;
  startDate = new Date(1990);
  personalForm: FormGroup;
  accountForm: FormGroup;

  constructor(public afs: AngularFirestore,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<EditProfileComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.personalForm = this.formBuilder.group({
      name: [this.data.userData.name, [
        Validators.minLength(2),
        Validators.maxLength(15),
        Validators.required,
        Validators.pattern('[A-zÀ-ÿ ]*'),
      ]],
      lastName: [this.data.userData.lastName, [
        Validators.minLength(2),
        Validators.maxLength(15),
        Validators.required,
        Validators.pattern('[A-zÀ-ÿ ]*'),
      ]],
      gender: [this.data.userData.gender, Validators.required],
      birthday: [this.data.userData.birthday, Validators.required],
    });

    this.accountForm = this.formBuilder.group({
      userName: [this.data.userData.userName,
        [Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          Validators.pattern('^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+$')],
        CustomValidator.userName(this.afs),
      ],
      country: [this.data.userData.country, Validators.required],
      bio: [this.data.userData.bio, [
        Validators.required,
        Validators.maxLength(200)
      ]],
    });
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


  public saveChanges() {
    this.data.userData.name = this.name.value;
    this.data.userData.lastName = this.lastName.value;
    this.data.userData.gender = this.gender.value;
    this.data.userData.birthday = this.birthday.value;
    this.data.userData.userName = this.userName.value;
    this.data.userData.country = this.country.value;
    this.data.userData.bio = this.bio.value;

    this.data.userData.setUp = true;
    this.dialogRef.close(this.data.userData);
  }

  public onNoClick() {
    this.dialogRef.close();
  }

}

export class CustomValidator {
  static userName(afs: AngularFirestore) {
    return (control: AbstractControl) => {
      console.log('Inside customValidator!');
      const username = control.value.toLowerCase();
      return afs.collection('users', ref => ref.where('userName', '==', username))
        .valueChanges().pipe(
          debounceTime(300), // make sure user stopped writing
          take(1),
          map(arr => arr.length ? {usernameAvailable: false} : null),
        );
    };
  }
}
