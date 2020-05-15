import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '../../core/services/firestore.service';
import {User} from '../../class/user';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  allUsers: User[] = null;

  constructor(private firestoreService: FirestoreService, public authService: AuthService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.firestoreService.getAllUsers().get().then(
      querySnapshot => {
        this.allUsers = [];
        querySnapshot.forEach(user => {
          this.allUsers.push(user.data() as User);
        });
      }
    );
  }
}
