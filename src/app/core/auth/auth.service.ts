// import { computed, inject, Injectable, signal } from '@angular/core';
// import { jwtDecode } from 'jwt-decode';

// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { User } from '../user/user.model';
// import { LoginCredentials, LoginResponse } from './auth.model';
// import { catchError, Observable, tap, throwError } from 'rxjs';

// import { ROLE_SERVICE_TOKEN } from '../role/role-service.token';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private httpClient = inject(HttpClient);
//   private router = inject(Router);
//   private roleService = inject(ROLE_SERVICE_TOKEN);

//   private readonly API_URL = 'https://localhost:xxxx/blabla';

//   // per salvare user e token
//   private userState = signal<User | null>(null);
//   private tokenState = signal<string | null>(null);

//   // esposizione di user e stato loggato
//   readonly currentUser = this.userState.asReadonly();
//   readonly isLoggedIn = computed(() => !!this.userState());

//   // per ricavare  se admin
//   readonly isAdmin = computed(() => {
//     const user = this.userState();
//     const roles = this.roleService.allRoles();
//     const adminRole = roles.find((role) => role.roleName.toLowerCase() === 'admin');
//     return user?.roleId === adminRole?.id;
//   });

//   //officeId dell'utente loggato
//   readonly userOfficeId = computed(() => this.userState()?.officeId);

//   //per mappare ruolo utente e categoria del be (per gestire accesso categorie)
//   private readonly roleMapping: Record<string, string> = {
//     medicalArea: 'Medical',
//     securityArea: 'Security',
//     officeArea: 'Office',
//     breakArea: 'Break',
//   };

//   // rotta iniziale dopo login (admin verso dashboard, user verso elenco categorie)
//   getInitialRoute(): string {
//     return this.isAdmin() ? '/dashboard' : '/categories';
//   }

//   //per esporre token
//   getToken() {
//     return this.tokenState();
//   }

//   login(credentials: LoginCredentials): Observable<LoginResponse> {
//     return this.httpClient.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
//       tap((response) => {
//         this.tokenState.set(response.token);

//         // Decodifica per ricavare lo User
//         const decoded: any = jwtDecode(response.token);

//         // Mappatura
//         const user: User = {
//           id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
//           email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
//           firstName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
//           lastName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
//           roleId: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
//           officeId: decoded['OfficeId'],
//           isConfirmed: true,
//         };

//         this.userState.set(user);
//       }),
//       catchError((err) => throwError(() => new Error(err.error || 'Login Error'))),
//     );
//   }

//   //per capire se utente ha accesso a categoria (metodo utilizzato nella categoryGuard) //o fare mapping con id dal service per avere il nome o utilizzare id
//   canAccessCategory(categoryName: string): boolean {
//     const user = this.userState();
//     if (!user) return false;
//     if (user.role === 'admin') return true;

//     //confronta ruolo mappato con nome categoria nell url
//     const requiredCategory = this.roleMapping[user.role];
//     return requiredCategory?.toLowerCase() === categoryName?.toLowerCase();
//   }

//   logout(): void {
//     this.userState.set(null);
//     this.tokenState.set(null);
//     this.router.navigate(['/login']);

//   }
// }
