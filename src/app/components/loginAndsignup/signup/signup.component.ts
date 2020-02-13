import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {countryList} from '../../../enums/countries.enum';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from '../../../class/user';
import {AuthService} from '../../../core/services/auth.service';
import {debounceTime, map, take} from 'rxjs/operators';
import {DefaultRegex} from '../../../enums/regex.enum';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService) {
  }

  ngOnInit() {

  }

  /*saveData() {
    const newUserData: User = {
      personalInfo: {
        userId: null,
        email: null,
        name: this.name.value,
        lastName: this.lastName.value,
        gender: this.gender.value,
        birthday: this.birthday.value
      },
      accountInfo: {
        userName: this.userName.value,
        registrationDate: null,
        imageUrl: null,
        country: this.country.value,
        bio: this.bio.value,
        socialLinks: {
          facebook: null,
          github: null,
          instagram: null,
          linkedin: null,
          twitter: null,
          youtube: null,
        },
        mapPointers: [
          {
            lat: null,
            lng: null,
            title: null,
            description: null,
          }
        ],
      },
      statisticsInfo: {
        followers: 0,
        following: 0,
        posts: 0
      }
    };*/

  signUpWithGoogle() {
    this.authService.googleAuth();
  }

}
