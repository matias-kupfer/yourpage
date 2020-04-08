import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../class/user';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  searchUser = '';

  @Input() users: User[];

  constructor() {
  }

  ngOnInit() {
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
