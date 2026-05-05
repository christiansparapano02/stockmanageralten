import { computed, inject, Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';

import { ROLE_SERVICE_TOKEN } from '../role/role-service.token';
import { LoginCredentials, LoginResponse } from '../../shared/models/auth.model';
import { SessionService } from '../../shared/services/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private session = inject(SessionService);
  private roleService = inject(ROLE_SERVICE_TOKEN);

  private readonly API_URL = 'http://72.146.152.45:8080'; //sostituire

  login(credentials: LoginCredentials): Observable<any> {
    return this.httpClient.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response: LoginResponse) => {
        this.session.initSession(response.token, response.expirationDate, response.refreshToken);
      }),
      switchMap(() => this.roleService.loadRoles()), //switchMap per saltare a un'altra chiamata per caricare ruoli (forse meglio caricare userRoles)
      tap(() => {
        const destination = this.session.getInitialRoute();
        this.router.navigate([destination]);
      }),
      catchError((error) => {
        this.session.clearSession();
        return throwError(() => error);
      }),
    );
  }

  //metodo refresh
  refresh(): Observable<LoginResponse> {
    const refreshToken = this.session.getRefreshToken();
    return this.httpClient.post<LoginResponse>(`${this.API_URL}/refresh`, { refreshToken }).pipe(
      tap((response: LoginResponse) => {
        this.session.setToken(response.token);
        this.session.setRefreshToken(response.refreshToken);
        const currentSession = this.session.user();
        if (currentSession) {
          this.session.updateSession({
            ...currentSession,
            expiresAt: new Date(response.expirationDate).getTime(),
          });
        }
      }),
      catchError((error) => {
        this.logout();
        this.session.clearSession();
        return throwError(() => error);
      }),
    );
  }

  // }

  logout(): void {
    this.session.clearSession();
    this.router.navigate(['/login']);
  }
}
