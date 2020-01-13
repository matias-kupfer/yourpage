import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {MatDialog} from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from '../../interfaces/user';
import {FirestoreService} from '../../core/services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  homeData: User = null;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    /*this.firestoreService.getUserById('NyATHV5khjZVLiQcdgJ9Yv61Vl22')
      .onSnapshot(doc => {
        if (doc.data()) {
          this.homeData = doc.data() as User;
        }
      });*/
  }
}
