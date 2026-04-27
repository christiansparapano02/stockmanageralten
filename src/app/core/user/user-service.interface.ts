import { Signal } from '@angular/core';
import { User } from './user.model';
import { Observable } from 'rxjs';

export interface IUserService {
  readonly allUsers: Signal<User[]>;
  loadUsers(officeId: string): Observable<User[]>; //carichiamo utenti filtrati per ufficio
  addUser(user: User): Observable<User>;
  updateUser(user: User): Observable<User>;
  deleteUser(id: string): Observable<void>;
}
