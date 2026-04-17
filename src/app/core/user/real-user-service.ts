import { inject, Injectable, signal } from '@angular/core';
import { IUserService } from './user-service.interface';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RealUserService implements IUserService {
  private httpClient = inject(HttpClient);
  private users = signal<User[]>([]);

  readonly allUsers = this.users.asReadonly();

  //url base per get utenti
  private apiUrl = 'https://api...blablabla'; //MODIFICARE

  constructor() {}

  //caricamento iniziale
  loadUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiUrl).pipe(tap((data) => this.users.set(data)));
  }

  addUser(user: User): Observable<User> {
    //invio dati al server (senza ID o con ID nullo)
    return this.httpClient.post<User>(this.apiUrl, user).pipe(
      tap((newUser) => {
        //il server risponde con utente completo (incluso uuid generato da DB)
        this.users.update((current) => [...current, newUser]);
      }),
    );
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
      tap((updatedUser) => {
        this.users.update((current) =>
          current.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
        );
      }),
    );
  }
  deleteUser(id: string) {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        // Rimuovo dalla lista locale solo se l'eliminazione sul server ha avuto successo
        this.users.update((current) => current.filter((u) => u.id !== id));
      }),
    );
  }
}

//poi gestire errori, come email già esistente
