import {Component, OnInit, Input} from '@angular/core';
import {User} from '../../../class/user';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  public age: number = null;

  @Input()
  userData: User;

  constructor() {
  }

  ngOnInit() {
    this.getAge();
  }

  public getAge() {
    // @ts-ignore
    const timeDiff = Math.abs(Date.now() - new Date(this.userData.personalInfo.birthday.toDate()).getTime());
    this.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
  }

}
