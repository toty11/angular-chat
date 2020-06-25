import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';


@Injectable({providedIn: 'root',})
export class UserService {

  user: User;
  private userSource = new BehaviorSubject(this.user);
  currentUser = this.userSource.asObservable();

  constructor() { }

  changeUser(user: User) {
    this.userSource.next(user);
  }

}
