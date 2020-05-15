import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environmentProd} from '../../../environments/environment.prod';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, public authService: AuthService) {
  }

  public toggleFollow(otherUser: string, action: string): Observable<any> {
    const userId = this.authService.user$.getValue().personalInfo.userId;
    return this.http.post(`${environmentProd.url}/api/toggleFollow/${userId}/${otherUser}/${action}`, {});
  }

}
