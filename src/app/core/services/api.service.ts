import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  public toggleFollow(otherUser: string, action: string): Observable<any> {
    const userId = this.authService.user$.getValue().personalInfo.userId;
    return this.http.post(`${environment.url}/api/toggleFollow/${userId}/${otherUser}/${action}`, {});
  }

}
