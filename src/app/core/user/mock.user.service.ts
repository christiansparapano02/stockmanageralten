import { Injectable, signal } from '@angular/core';
import { User } from './user.model';
import { IUserService } from './user-service.interface';
import { delay, Observable, of, tap } from 'rxjs';

@Injectable() //no provideIn: 'root' perchè gestito dal Token
export class MockUserService implements IUserService {
  private mockUsers = signal<User[]>([
    {
      id: '1',
      firstName: 'Marco',
      lastName: 'Bianchi',
      email: 'm.bianchi@azienda.it',
      role: 'admin',
    },
    {
      id: '2',
      firstName: 'Giulia',
      lastName: 'Verdi',
      email: 'g.verdi@azienda.it',
      role: 'medicalArea',
    },
    {
      id: '3',
      firstName: 'Luca',
      lastName: 'Neri',
      email: 'l.neri@azienda.it',
      role: 'officeArea',
    },
    {
      id: '4',
      firstName: 'Anna',
      lastName: 'Rossi',
      email: 'a.rossi@azienda.it',
      role: 'breakArea',
    },
  ]);

  //esporre lista user in sola lettura
  readonly allUsers = this.mockUsers.asReadonly();

  loadUsers(): Observable<User[]> {
    return of(this.mockUsers()).pipe(
      delay(900),
      tap((data) => this.mockUsers.set(data)),
    );
  }

  addUser(user: User): Observable<User> {
    const newUser: User = { ...user, id: crypto.randomUUID() }; //simula creazione ID che farebbe DB
    return of(newUser).pipe(
      delay(800), //restituisce observable che emette nuovo utente dopo 800ms
      tap((res) => this.mockUsers.update((current) => [...current, res])), //tap esegue azione senza interrompere stream (aggiorna signal di users)
    );
  }

  updateUser(updatedUser: User): Observable<User> {
    return of(updatedUser).pipe(
      delay(800),
      tap((res) =>
        this.mockUsers.update((current) => current.map((u) => (u.id === res.id ? res : u))),
      ),
    );
  }

  deleteUser(id: string): Observable<void> {
    return of(undefined).pipe(
      delay(800),
      tap(() =>
        this.mockUsers.update((currentUsers) => currentUsers.filter((user) => user.id !== id)),
      ),
    );
  }
}
