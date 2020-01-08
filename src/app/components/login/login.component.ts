import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  public loginWithGoogle() {
    this.authService.signInWithGoogle();
  }

}
