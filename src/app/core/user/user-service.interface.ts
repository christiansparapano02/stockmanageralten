import { Signal } from '@angular/core';
import { User } from './user.model';
import { Observable } from 'rxjs';

export interface IUserService {
  readonly allUsers: Signal<User[]>;
  loadUsers(): Observable<User[]>;
  addUser(user: User): Observable<User>;
  updateUser(user: User): Observable<User>;
  deleteUser(id: string): Observable<void>;
}
