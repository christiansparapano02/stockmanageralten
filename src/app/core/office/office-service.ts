import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Office } from './office.model';
import { IOfficeService } from './office-service.interface';

@Injectable({
  providedIn: 'root',
})
export class OfficeService implements IOfficeService {
  private httpClient = inject(HttpClient);
  private offices = signal<Office[]>([]);

  readonly allOffices = this.offices.asReadonly();

  private apiUrl = '/api/Offices';

  //elenco uffici
  getAllOffices(): Observable<Office[]> {
    return this.httpClient.get<Office[]>(this.apiUrl).pipe(tap((data) => this.offices.set(data)));
  }

  //Recupera i dettagli di un ufficio specifico tramite il suo ID
  getOfficeById(id: string): Observable<Office> {
    return this.httpClient.get<Office>(`${this.apiUrl}/${id}`);
  }
}
