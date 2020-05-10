import {Component, NgZone, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AppComponent} from '../../../app.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public userData = this.authService.user$.getValue();

  constructor(private authService: AuthService, private ngZone: NgZone, private appComponent: AppComponent) {
  }

  ngOnInit() {
    this.userDataSubscription();
  }

  userDataSubscription() {
    this.authService.user$
      .subscribe((doc) => {
        this.ngZone.run(() => {
          this.userData = doc;
        });
      });
  }


}
