import { Component, OnInit } from '@angular/core';
import {FirestoreService} from '../../core/services/firestore.service';
import {User} from '../../class/user';
import {ImagePost} from '../../class/imagePost';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  filter: number;
  query: string;
  users: User[];
  posts: ImagePost[];

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
  }

  search() {
  }

  getAllUsers() {
    this.firestoreService.getAllUsers().get().then(
      querySnapshot => {
        this.users = [];
        querySnapshot.forEach(user => {
          this.users.push(user.data() as User);
        });
      }
    );
  }

  searchUsers(user: User) {
    if (this.query === '') {
      return true;
    }
    const usernameMatchResult = this.searchLetterMatch(user.accountInfo.userName);
    return usernameMatchResult ? true : this.searchLetterMatch(user.personalInfo.name);
  }

  searchLetterMatch(userName: string) {
    const userNameArray = userName.split('');
    const searchUserArray = this.query.split('');
    for (let i = 0; i < this.query.length; i++) {
      if (userNameArray[i] !== searchUserArray[i]) {
        return false;
      }
    }
    return true;
  }

}
