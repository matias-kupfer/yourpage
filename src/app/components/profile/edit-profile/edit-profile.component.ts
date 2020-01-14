import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, take, debounceTime} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {countryList} from '../../../enums/countries.enum';
import {User} from '../../../interfaces/user';
import {CustomValidator} from '../../loginAndsignup/signup/signup.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  countryList: any[] = countryList;
  isSetUp: boolean;

  personalForm: FormGroup;
  accountForm: FormGroup;

  constructor(public afs: AngularFirestore,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<EditProfileComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.personalForm = new FormGroup({
      name: new FormControl({value: this.data.userData.personalInfo.name, disabled: true},
        [
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.required,
          Validators.pattern('[A-zÀ-ÿ ]*'),
        ]),
      lastName: new FormControl({value: this.data.userData.personalInfo.lastName, disabled: true},
        [
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.required,
          Validators.pattern('[A-zÀ-ÿ ]*'),
        ]),
      gender: new FormControl({value: this.data.userData.personalInfo.gender, disabled: true},
        Validators.required),
      birthday: new FormControl({value: this.data.userData.personalInfo.birthday, disabled: true}, Validators.required),
    });

    this.accountForm = new FormGroup({
      userName: new FormControl({value: this.data.userData.accountInfo.userName, disabled: true},
        [Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          Validators.pattern('^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+$')],
        CustomValidator.userName(this.afs),
      ),
      country: new FormControl(this.data.userData.accountInfo.country, Validators.required),
      bio: new FormControl(this.data.userData.accountInfo.bio, [
        Validators.required,
        Validators.maxLength(200)
      ]),
    });
    /*this.isSetUp = this.data.userData.personalInfo.setUp;
    if (this.isSetUp) {
      this.name.disable();
      this.lastName.disable();
      this.gender.disable();
      this.birthday.disable();
    }*/
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
    this.data.userData.personalInfo.name = this.name.value;
    this.data.userData.personalInfo.lastName = this.lastName.value;
    this.data.userData.personalInfo.gender = this.gender.value;
    this.data.userData.personalInfo.birthday = this.birthday.value;
    this.data.userData.accountInfo.userName = this.userName.value;
    this.data.userData.accountInfo.country = this.country.value;
    this.data.userData.accountInfo.bio = this.bio.value;

    if (!this.isSetUp) {
      this.data.userData.personalInfo.setUp = true;
    }

    // validate if changes were made
    if (JSON.stringify(this.data.userData) === JSON.stringify(JSON.parse(localStorage.getItem('user')) as User)) {
      this.dialogRef.close({});
    } else {
      this.dialogRef.close(this.data.userData);
    }
  }

  public onNoClick() {
    this.dialogRef.close();
  }
}
