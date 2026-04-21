import { computed, inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, UserRole } from '../user/user.model';
import { LoginCredentials, LoginResponse } from './auth.model';
import { Observable, tap } from 'rxjs';

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

    const requiredCategory = this.roleMapping[user.role];
    return requiredCategory?.toLowerCase() === categoryName?.toLowerCase();
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        const token = response.token;
        this.tokenState.set(token);

        // Decodifica per ricavare lo User
        const decoded: any = jwtDecode(token);

        const user: User = {
          email: decoded.email || decoded.unique_name,
          firstName: decoded.given_name || '',
          lastName: decoded.family_name || '',
          role: (decoded.role ||
            decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) as UserRole,
        };

        this.userState.set(user);
      }),
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
