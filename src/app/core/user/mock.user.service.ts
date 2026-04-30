import { Injectable, signal } from '@angular/core';
import { User } from './user.model';
import { IUserService } from './user-service.interface';
import { delay, Observable, of, tap } from 'rxjs';

@Injectable() //no provideIn: 'root' perchè gestito dal Token
export class MockUserService implements IUserService {
  private mockUsers = signal<User[]>([
    {
      id: 'u1',
      firstName: 'Marco',
      lastName: 'Bianchi',
      email: 'm.bianchi@test.it',
      phone: '3395748383',
      officeId: 'milano01',
      roleId: 'role-admin-id',
      isConfirmed: true,
    },
    {
      id: 'u2',
      firstName: 'Giulia',
      lastName: 'Verdi',
      email: 'g.verdi@test.it',
      phone: '3923847584',
      officeId: 'milano01',
      roleId: 'role-medical-id',
      isConfirmed: true,
    },
    {
      id: 'u3',
      firstName: 'Luca',
      lastName: 'Neri',
      email: 'l.neri@test.it',
      phone: '33385948645',
      officeId: 'roma01',
      roleId: 'role-office-id',
      isConfirmed: true,
    },
    {
      id: 'u4',
      firstName: 'Anna',
      lastName: 'Rossi',
      email: 'a.rossi@test.it',
      phone: '3204958100',
      officeId: 'milano01',
      roleId: 'role-break-id',
      isConfirmed: false,
    },
  ]);

  //esporre lista user in sola lettura
  readonly allUsers = this.mockUsers.asReadonly();

  loadUsers(officeId: string): Observable<User[]> {
    // simulazione filtro per sede
    const filtered = this.mockUsers().filter((u) => u.officeId === officeId);
    return of(filtered).pipe(delay(800));
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
