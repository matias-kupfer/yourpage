import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DefaultRegex} from '../../enums/regex.enum';

@Component({
  selector: 'app-login',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class AuthenticateComponent implements OnInit {
  loginForm: FormGroup;
  signUpForm: FormGroup;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    // LOGIN FORM
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
      ]),
    });

    // SIGN UP FORM
    this.signUpForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
        Validators.pattern(DefaultRegex.default),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
        Validators.pattern(DefaultRegex.default),
      ]),
      emailS: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      passwordS: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
    });
  }

  // LOGIN
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  public googleAuth() {
    this.authService.googleAuth();
  }

  public loginWithEmail() {
    this.authService.loginWithUserPassword(this.email.value, this.password.value);
  }

  // SIGN UP
  get name() {
    return this.signUpForm.get('name');
  }

  get lastName() {
    return this.signUpForm.get('lastName');
  }

  get emailS() {
    return this.signUpForm.get('emailS');
  }

  get passwordS() {
    return this.signUpForm.get('passwordS');
  }

  signUpWithEmailAndPassword() {
    this.authService.signUpWithUserAndPassword(this.name.value, this.lastName.value, this.emailS.value, this.passwordS.value);
  }
}
