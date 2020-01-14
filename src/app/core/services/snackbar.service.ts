import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  public notification$: Subject<any> = new Subject();

  constructor() { }

// @TODO actions from service not working
}
