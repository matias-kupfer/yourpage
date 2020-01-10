import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {countryList} from '../../../enums/countries.enum';
import {CustomValidator} from '../../profile/edit-profile/edit-profile.component';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from '../../../interfaces/user';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  countryList: any[] = countryList;
  newUserData: User;
  canSignUp = false;

  personalForm: FormGroup;
  accountForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              public afs: AngularFirestore,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.personalForm = this.formBuilder.group({
      name: ['', [
        Validators.minLength(2),
        Validators.maxLength(15),
        Validators.required,
        Validators.pattern('[A-zÀ-ÿ ]*'),
      ]],
      lastName: ['', [
        Validators.minLength(2),
        Validators.maxLength(15),
        Validators.required,
        Validators.pattern('[A-zÀ-ÿ ]*'),
      ]],
      gender: [Validators.required],
      birthday: [Validators.required],
    });

    this.accountForm = this.formBuilder.group({
      userName: ['',
        [Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
          Validators.pattern('^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+$')],
        CustomValidator.userName(this.afs),
      ],
      country: [Validators.required],
      bio: ['', [
        Validators.required,
        Validators.maxLength(200)
      ]],
    });
  }

  get name() {
    return this.personalForm.get('name').value;
  }

  get lastName() {
    return this.personalForm.get('lastName').value;
  }

  get gender() {
    return this.personalForm.get('gender').value;
  }

  get birthday() {
    return this.personalForm.get('birthday').value;
  }

  get userName() {
    return this.accountForm.get('userName').value;
  }

  get country() {
    return this.accountForm.get('country').value;
  }

  get bio() {
    return this.accountForm.get('bio').value;
  }

  saveData() {
    const newUserData: User = {
      personalInfo: {
        userId: null,
        email: null,
        name: this.name,
        lastName: this.lastName,
        gender: this.gender,
        birthday: this.birthday
      },
      accountInfo: {
        userName: this.userName,
        registrationDate: null,
        imageUrl: null,
        country: this.country,
        bio: this.bio
      },
      statisticsInfo: {
        followers: 0,
        following: 0,
        posts: 0
      }
    };
    this.newUserData = newUserData;
    this.canSignUp = true;
  }

  signUpWithGoogle() {
    this.authService.googleAuth(this.newUserData);
  }

}
