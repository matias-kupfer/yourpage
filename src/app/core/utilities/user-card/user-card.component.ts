import {Component, OnInit, Input} from '@angular/core';
import {User} from '../../../class/user';
import {AppComponent} from '../../../app.component';
import {AuthService} from '../../services/auth.service';
import {DefaultRoutes} from '../../../enums/default.routes';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {ApiResponse} from '../../../interfaces/api-response';
import {MatDialog, MatSnackBar} from '@angular/material';
import {UsersListComponent} from '../../../components/profile/users-list/users-list.component';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  public age: number = null;
  public loading = false;

  @Input() userData: User;
  @Input() isUserProfile: boolean;

  constructor(private appComponent: AppComponent,
              private authService: AuthService,
              private router: Router,
              private apiService: ApiService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getAge();
  }

  public getAge() {
    // @ts-ignore
    const timeDiff = Math.abs(Date.now() - new Date(this.userData.personalInfo.birthday.toDate()).getTime());
    this.age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
  }

  public toggleFollow(action: string) {
    if (!this.authService.isLoggedIn) { // not logged in cannot follow
      this.router.navigate([DefaultRoutes.OnLoginButtonClick]);
      return;
    }
    this.loading = true;
    this.apiService.toggleFollow(this.userData.personalInfo.userId, action).subscribe((r: ApiResponse) => {
      this.loading = false;
      if (!r.success) {
        this.snackBar.open(r.message, 'dismiss', {
          duration: 4000, /*not working*/
        });
      }
    });
  }

  public isFollowing() {
    for (const following of this.authService.user$.getValue().following) {
      if (following === this.userData.personalInfo.userId) {
        return true;
      }
    }
    return false;
  }
}
