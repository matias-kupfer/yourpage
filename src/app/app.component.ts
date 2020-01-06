import {Component, Inject} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AuthService} from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'yourpage | By: Matias Kupfer';

  constructor() {
  }
}
