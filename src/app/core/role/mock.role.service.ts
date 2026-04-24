import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';
import { Role } from './role.model';
import { IRoleService } from './role-service.interface';

@Injectable({
  providedIn: 'root',
})
export class MockRoleService implements IRoleService {
  private readonly MOCK_ROLES: Role[] = [
    { id: '3e89b31d-ac13-40b9-be71-9510fc2586c5', roleName: 'Administrator' },
    { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', roleName: 'Medical Area' },
    { id: '550e8400-e29b-41d4-a716-446655440000', roleName: 'Office' },
    { id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', roleName: 'Security' },
    { id: 'ad6bd000-88cf-11eb-8dcd-0242ac130003', roleName: 'Break Area' },
  ];

  private roles = signal<Role[]>([]);
  readonly allRoles = this.roles.asReadonly();

  loadRoles(): Observable<Role[]> {
    return of(this.MOCK_ROLES).pipe(
      delay(400),
      tap((data) => this.roles.set(data)),
    );
  }
}
