import {Component, OnInit} from '@angular/core';
import {FirestoreService} from '../../core/services/firestore.service';
import {User} from '../../interfaces/user';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  allUsers: User[] = null;
  searchUser = '';

  constructor(private firestoreService: FirestoreService,) {
  }

  ngOnInit() {
    this.firestoreService.getAllUsers().get().then(
      querySnapshot => {
        this.allUsers = [];
        querySnapshot.forEach(user => {
          // user.exists
          this.allUsers.push(user.data() as User);
        });
      }
    );
  }

  searchUsers(user: User) {
    if (this.searchUser === '') {
      return true;
    }
    const usernameMatchResult = this.searchLetterMatch(user.accountInfo.userName);
    return usernameMatchResult ? true : this.searchLetterMatch(user.personalInfo.name);
  }

  searchLetterMatch(userName: string) {
    const userNameArray = userName.split('');
    const searchUserArray = this.searchUser.split('');
    for (let i = 0; i < this.searchUser.length; i++) {
      if (userNameArray[i] !== searchUserArray[i]) {
        return false;
      }
    }
    return true;
  }
}
