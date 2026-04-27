import { Signal } from '@angular/core';

import { Observable } from 'rxjs';
import { Office } from './office.model';

export interface IOfficeService {
  readonly allOffices: Signal<Office[]>;
  getAllOffices(): Observable<Office[]>;
  getOfficeById(id: string): Observable<Office>;
}
