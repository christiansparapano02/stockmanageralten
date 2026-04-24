import { signal, Injectable } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';
import { Office } from './office.model';
import { IOfficeService } from './office-service.interface';

@Injectable({
  providedIn: 'root',
})
export class MockOfficeService implements IOfficeService {
  // Dati mockati
  private readonly MOCK_OFFICES: Office[] = [
    {
      id: '95648c6f-b0aa-458f-98a2-a9b98c15290b',
      phone: '+39 02 1234567',
      zipCode: '20121',
      street: 'Via Montenapoleone, 1',
      city: 'Milano',
      region: 'Lombardia',
      state: 'Italy',
    },
    {
      id: 'uuid-roma-01',
      phone: '+39 06 7654321',
      zipCode: '00186',
      street: 'Via del Corso, 10',
      city: 'Roma',
      region: 'Lazio',
      state: 'Italy',
    },
  ];

  private offices = signal<Office[]>([]);
  readonly allOffices = this.offices.asReadonly();

  getAllOffices(): Observable<Office[]> {
    return of(this.MOCK_OFFICES).pipe(
      delay(500),
      tap((data) => this.offices.set(data)),
    );
  }

  getOfficeById(id: string): Observable<Office> {
    const office = this.MOCK_OFFICES.find((office) => office.id === id);
    if (!office) {
      throw new Error('Office not found');
    }
    return of(office).pipe(delay(300));
  }
}
