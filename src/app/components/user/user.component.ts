import {Component, OnInit} from '@angular/core';
import {User} from '../../interfaces/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  // public userName = this.route.snapshot.paramMap.get('userName');
  constructor() {
  }

  ngOnInit() {
    // if it's user's profile
    /*if (this.userData && this.userData.accountInfo.userName === this.userName) {
      this.firestoreService.getUserById(this.userData.personalInfo.userId)
        .onSnapshot(doc => {
          if (doc.data()) {
            const updatedUser: User = doc.data() as User;
            // this.userData = updatedUser;
            this.isProfileOwner = true;
          }
        });
    } else { // visitor. NOT profile owner
      this.firestoreService.getUserByUserName(this.userName)
        .onSnapshot((doc) => {
          if (doc.docs[0]) {
            const updatedUser: User = doc.docs[0].data();
            this.userData = updatedUser;
          }
        });
    }*/
  }

}
