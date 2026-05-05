import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthSession } from '../models/auth.model';
import { CATEGORY_IDS, ROLE_IDS } from '../auth.constants';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class SessionService {
  //dati dell'utente o null se non loggato
  private _session = signal<AuthSession | null>(null);
  private _token: string | null = null;
  private _refreshToken: string | null = null;

  readonly user = this._session.asReadonly();
  readonly isLoggedIn = computed(() => !!this._session());
  readonly userOfficeId = computed(() => this._session()?.officeId);
  readonly isAdmin = computed(() => this._session()?.roleId === ROLE_IDS.ADMIN);
  readonly userFullName = computed(() => {
    return this._session() ? `${this._session()?.firstName} ${this._session()?.lastName}` : '';
  });

  //dove andare in base a se admin o user di categoria
  getInitialRoute(): string {
    if (this.isAdmin()) {
      return '/dashboard';
    }

    return '/categories';
  }

  // Mapping Ruolo - Categoria (perchè dal token arriva ruolo, nell url leggiamo la categoria)
  private readonly roleToCategoryMap: Record<string, string> = {
    [ROLE_IDS.MEDICAL]: CATEGORY_IDS.MEDICAL,
    [ROLE_IDS.SECURITY]: CATEGORY_IDS.SECURITY,
    [ROLE_IDS.OFFICE]: CATEGORY_IDS.OFFICE,
    [ROLE_IDS.BREAK]: CATEGORY_IDS.BREAK,
  };

  //capire se be cambia nome claims
  initSession(token: string, expirationDate: string, refreshToken: string): void {
    this._token = token; // memorizziamo il token
    this._refreshToken = refreshToken;
    const decoded: any = jwtDecode(token);
    const expiresAt = new Date(expirationDate).getTime(); //converte data in numero intero

    this._session.set({
      id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      firstName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
      lastName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
      roleId: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      officeId: decoded['OfficeId'],
      expiresAt: expiresAt,
    });
  }

  //per esporre token
  getToken(): string | null {
    return this._token;
  }

  //per esporre refreshToken
  getRefreshToken(): string | null {
    return this._refreshToken;
  }

  setToken(token: string) {
    this._token = token;
  }

  setRefreshToken(rt: string) {
    this._refreshToken = rt;
  }

  updateSession(data: AuthSession) {
    this._session.set(data);
  }

  //utilizzato nella guard
  canAccessCategory(categoryId: string): boolean {
    if (this.isAdmin()) return true;
    return this.roleToCategoryMap[this._session()?.roleId!] === categoryId;
  }

  clearSession() {
    this._session.set(null);
    this._token = null;
    this._refreshToken = null;
  }
}
