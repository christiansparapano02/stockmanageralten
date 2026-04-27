import { Signal } from '@angular/core';

import { Observable } from 'rxjs';

import { Role } from './role.model';

export interface IRoleService {
  readonly allRoles: Signal<Role[]>;
  loadRoles(): Observable<Role[]>;
}
