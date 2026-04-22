import { computed, inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, UserRole } from '../user/user.model';
import { LoginCredentials, LoginResponse } from './auth.model';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = 'https://localhost:xxxx/blabla';

  // per salvare user e token
  private userState = signal<User | null>(null);
  private tokenState = signal<string | null>(null);

  // esposizione di user e stato loggato
  readonly currentUser = this.userState.asReadonly();
  readonly isLoggedIn = computed(() => !!this.userState());

  // per ricavare subito se admin
  readonly isAdmin = computed(() => this.userState()?.role === 'admin');

  //per mappare ruolo utente e categoria del be (per gestire accesso categorie)
  private readonly roleMapping: Record<string, string> = {
    medicalArea: 'Medical',
    securityArea: 'Security',
    officeArea: 'Office',
    breakArea: 'Break',
  };

  // rotta iniziale dopo login (admin verso dashboard, user verso elenco categorie)
  getInitialRoute(): string {
    return this.isAdmin() ? '/dashboard' : '/categories';
  }

  //per esporre token
  getToken() {
    return this.tokenState();
  }

  //per capire se utente ha accesso a categoria (metodo utilizzato nella categoryGuard)
  canAccessCategory(categoryName: string): boolean {
    const user = this.userState();
    if (!user) return false;
    if (user.role === 'admin') return true;

    //confronta ruolo mappato con nome categoria nell url
    const requiredCategory = this.roleMapping[user.role];
    return requiredCategory?.toLowerCase() === categoryName?.toLowerCase();
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        this.tokenState.set(response.token);

        // Decodifica per ricavare lo User
        const decoded: any = jwtDecode(response.token);

        // Mappatura
        const user: User = {
          id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'], // GUID Utente
          email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
          firstName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
          lastName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],

          role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as UserRole,
        };

        this.userState.set(user);
      }),
      catchError((err) => throwError(() => new Error(err.error || 'Login Error'))),
    );
  }

  logout(): void {
    this.userState.set(null);
    this.tokenState.set(null);
    this.router.navigate(['/login']);
  }

  // //CODICE MICHELE
  // activePermission = signal<Permission>('user');
  // authenticate(email: string, password: string) {
  //   console.log(email, password);
  //   if (email === 'admin@example.com' && password === 'admin') {
  //     this.activePermission.set('admin');
  //   } else if (email === 'user@example.com' && password === 'user') {
  //     this.activePermission.set('user');
  //   }
  // }
  // logout() {
  //   this.activePermission.set('user');
  // }
}
