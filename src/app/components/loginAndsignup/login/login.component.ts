import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DefaultRegex} from '../../../enums/regex.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.login = new FormGroup({
      email: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
    });
  }

  get email() {
    return this.login.get('email');
  }

  get password() {
    return this.login.get('password');
  }

  public loginWithGoogle() {
    this.authService.googleAuth();
  }

  public loginWithEmail() {
    this.authService.loginWithUserPassword(this.email.value, this.password.value);
  }

}
