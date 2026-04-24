import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Role } from './role.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private httpClient = inject(HttpClient);
  private roles = signal<Role[]>([]);
  readonly allRoles = this.roles.asReadonly();

  private apiUrl = '/api/Roles';

  loadRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(this.apiUrl).pipe(tap((data) => this.roles.set(data)));
  }
}
