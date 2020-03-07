import {Component, NgZone, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public userData = this.authService.user$.getValue();

  constructor(private authService: AuthService, private ngZone: NgZone) {

  }

  ngOnInit(): void {
    this.userDataSubscription();
  }

  public onLogout() {
    this.authService.onLogout();
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
